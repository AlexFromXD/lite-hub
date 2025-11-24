import axios from "axios";
import { URL } from "url";
import { Request } from "express";
import { httpInvokeTask, wsInvokeTask } from "../../src/invoker/tasks";
import { HttpRequest } from "../../src/schema/http-request";
import { HttpResponse } from "../../src/schema/http-response";
import { RestRequest } from "../../src/schema/rest-request";
import { WSRequest } from "../../src/schema/ws-request";

vi.mock("axios");

const stubUrl = new URL("http://fake-lambda-url:8080");

const stubExpressRequest = {
  originalUrl: "https://example.com/api",
  headers: {},
  get: () => null,
} as unknown as Request;

afterEach(vi.clearAllMocks);

describe("httpInvokeTask()", () => {
  describe("when event arg is of HttpRequest", async () => {
    it("should call axios.post with the correct URL and event", async () => {
      const stubEvent = new HttpRequest(stubExpressRequest);
      const stubResponseData = {
        statusCode: 201,
        body: JSON.stringify({ someField: "someValue" }),
        isBase64Encoded: false,
      };
      vi.mocked(axios.post).mockResolvedValue({ data: stubResponseData });

      const task = httpInvokeTask(stubUrl)(stubEvent);
      const result = await task();

      expect(axios.post).toHaveBeenCalledWith(stubUrl.href, stubEvent);
      expect(result).toEqual({
        statusCode: stubResponseData.statusCode,
        body: stubResponseData.body,
        isBase64Encoded: false,
      });
    });

    it("should return data directly if the response is already a valid HttpResponse", async () => {
      const stubEvent = new HttpRequest(stubExpressRequest);
      const responseData = {
        statusCode: 201,
        isBase64Encoded: false,
        body: JSON.stringify({ someField: "someValue" }),
      };
      vi.mocked(axios.post).mockResolvedValue({ data: responseData });

      const task = httpInvokeTask(stubUrl)(stubEvent);
      const result = await task();

      const expected = {
        statusCode: responseData.statusCode,
        body: responseData.body,
        isBase64Encoded: responseData.isBase64Encoded,
      };
      expect(result).toEqual(expected);
    });

    it("should infer response if the response is a string", async () => {
      const stubEvent = new HttpRequest(stubExpressRequest);
      const responseData = "just a string";
      vi.mocked(axios.post).mockResolvedValue({ data: responseData });

      const task = httpInvokeTask(stubUrl)(stubEvent);
      const result = await task();

      expect(result).toEqual({
        statusCode: 200,
        body: "just a string",
        headers: { "Content-Type": "application/json" },
        isBase64Encoded: false,
      });
    });

    it("should infer response if the response is an object", async () => {
      const stubEvent = new HttpRequest(stubExpressRequest);
      const responseData = { message: "hello" };
      vi.mocked(axios.post).mockResolvedValue({ data: responseData });

      const task = httpInvokeTask(stubUrl)(stubEvent);
      const result = await task();

      expect(result).toEqual({
        statusCode: 200,
        body: JSON.stringify({ message: "hello" }),
        headers: { "Content-Type": "application/json" },
        isBase64Encoded: false,
      });
    });
  });

  describe("when event arg is of RestRequest", () => {
    it("should return data if the response is valid HttpResponse", async () => {
      const event = new RestRequest({
        get: () => null,
      } as unknown as Request);
      const responseData = {
        statusCode: 200,
        isBase64Encoded: false,
        body: "hello",
      } as HttpResponse;
      vi.mocked(axios.post).mockResolvedValue({ data: responseData });

      const task = httpInvokeTask(stubUrl)(event);
      const result = await task();

      expect(result).toBe(responseData);
    });

    it("should throw error if the invalid HttpResponse", async () => {
      const event = new RestRequest({
        get: () => null,
      } as unknown as Request);
      const invalidResponseData = { status: 200, body: "invalid" }; // Missing statusCode, isBase64Encoded
      vi.mocked(axios.post).mockResolvedValue({ data: invalidResponseData });

      const task = httpInvokeTask(stubUrl)(event);

      await expect(task()).rejects.toThrow(
        /Invalid response format from function/,
      );
    });
  });
});

describe("wsInvokeTask()", () => {
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
