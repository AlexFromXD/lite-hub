import { URL } from "node:url";
import { config } from "../../src/config";
import { FunctionNotFoundError } from "../../src/exception";
import { Invoker } from "../../src/invoker/invoker";
import { HttpRequest } from "../../src/schema/http-request";
import { WSRequest } from "../../src/schema/ws-request";
import { throttle } from "../../src/throttle";

vi.mock("../../src/config", () => ({
  config: {
    getOriginByFunction: vi.fn(),
  },
}));
vi.mock("../../src/throttle");

describe("Invoker", () => {
  let invoker: Invoker;

  beforeEach(() => {
    invoker = new Invoker();
  });

  afterEach(vi.clearAllMocks);

  describe("getUrl", () => {
    it("should return the correct URL for a given function name", () => {
      const StubFunctionName = "my-function";
      const StubOrigin = "http://localhost:8080";
      vi.mocked(config.getOriginByFunction).mockReturnValue(StubOrigin);

      const result = invoker.getUrl(StubFunctionName);

      expect(config.getOriginByFunction).toHaveBeenCalledWith(StubFunctionName);
      expect(result).toEqual(
        new URL("/2015-03-31/functions/function/invocations", StubOrigin),
      );
    });

    it("should throw FunctionNotFoundError if the function origin is not found", () => {
      const StubFunctionName = "unknown-function";
      vi.mocked(config.getOriginByFunction).mockReturnValue(undefined);

      const execution = () => invoker.getUrl(StubFunctionName);

      expect(execution).toThrow(new FunctionNotFoundError(StubFunctionName));
    });
  });

  describe("httpInvoke", () => {
    it("should call throttle.add with the correct task", async () => {
      const stubFunctionName = "http-func";
      const stubEvent = { body: "test" } as HttpRequest;
      const stubUrl = new URL("http://localhost:9000");
      vi.spyOn(invoker, "getUrl").mockReturnValue(stubUrl);

      await invoker.httpInvoke(stubFunctionName, stubEvent);

      expect(invoker.getUrl).toHaveBeenCalledWith(stubFunctionName);
      expect(throttle.add).toHaveBeenCalledWith(
        stubFunctionName,
        expect.any(Function),
      );
    });
  });

  describe("wsInvoke", () => {
    it("should call throttle.add with the correct task", async () => {
      const stubFunctionName = "ws-func";
      const stubEvent = { body: "test" } as WSRequest;
      const StubUrl = new URL("http://localhost:9001");
      vi.spyOn(invoker, "getUrl").mockReturnValue(StubUrl);

      await invoker.wsInvoke(stubFunctionName, stubEvent);

      expect(invoker.getUrl).toHaveBeenCalledWith(stubFunctionName);
      expect(throttle.add).toHaveBeenCalledWith(
        stubFunctionName,
        expect.any(Function),
      );
    });
  });
});
