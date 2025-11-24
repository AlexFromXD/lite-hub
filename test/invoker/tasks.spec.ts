import axios from "axios";
import { URL } from "url";
import { Request } from "express";
import { httpInvokeTask, wsInvokeTask } from "../../src/invoker/tasks";
import { HttpRequest } from "../../src/schema/http-request";
import { HttpResponse } from "../../src/schema/http-response";
import { RestRequest } from "../../src/schema/rest-request";
import { WSRequest } from "../../src/schema/ws-request";

vi.mock("axios");

describe("Invoke Tasks", () => {
  const stubUrl = new URL("http://fake-lambda-url:8080");

  afterEach(vi.clearAllMocks);

  describe("httpInvokeTask", () => {
    it("should call axios.post with the correct URL and event", async () => {
      const stubEvent = {} as HttpRequest;
      const stubResponseData = { statusCode: 200, body: "success" };
      vi.mocked(axios.post).mockResolvedValue({ data: stubResponseData });

      const task = httpInvokeTask(stubUrl)(stubEvent);
      const result = await task();

      expect(axios.post).toHaveBeenCalledWith(stubUrl.href, stubEvent);
      expect(result).toBe(stubResponseData);
    });

    it("should return data directly if event is HttpRequest", async () => {
      const stubEvent = {} as HttpRequest;
      const responseData = { any: "data" };
      vi.mocked(axios.post).mockResolvedValue({ data: responseData });

      const task = httpInvokeTask(stubUrl)(stubEvent);
      const result = await task();

      expect(result).toBe(responseData);
    });

    it("should return data if event is RestRequest and response is valid HttpResponse", async () => {
      const mockEvent = {} as RestRequest;
      const stubResponseData = {
        statusCode: 200,
        isBase64Encoded: false,
        body: "hello",
      } as HttpResponse;
      vi.mocked(axios.post).mockResolvedValue({ data: stubResponseData });

      const task = httpInvokeTask(stubUrl)(mockEvent);
      const result = await task();

      expect(result).toBe(stubResponseData);
    });

    it("should throw error if event is RestRequest and response is invalid HttpResponse", async () => {
      const mockEvent = new RestRequest({
        get: () => null,
      } as unknown as Request);
      const stubInvalidResponseData = { status: 200 }; // Missing statusCode, isBase64Encoded
      vi.mocked(axios.post).mockResolvedValue({
        data: stubInvalidResponseData,
      });

      const task = httpInvokeTask(stubUrl)(mockEvent);

      await expect(task()).rejects.toThrow(
        `Invalid response format from function "${stubUrl}"`,
      );
    });
  });

  describe("wsInvokeTask", () => {
    it("should call axios.post with invocation-type header", async () => {
      const stubEvent = { body: "ws-payload" } as WSRequest;
      const stubResponseData = { statusCode: 202 };
      vi.mocked(axios.post).mockResolvedValue({ data: stubResponseData });

      const task = wsInvokeTask(stubUrl)(stubEvent);
      const result = await task();

      expect(axios.post).toHaveBeenCalledWith(stubUrl.href, stubEvent, {
        headers: {
          "x-amz-invocation-type": "Event",
          "Content-Type": "application/json",
        },
      });
      expect(result).toBe(stubResponseData);
    });
  });
});
