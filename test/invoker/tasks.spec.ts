import axios from "axios";
import { URL } from "url";
import { httpInvokeTask, wsInvokeTask } from "../../src/invoker/tasks";
import { HttpRequest } from "../../src/schema/http-request";
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
