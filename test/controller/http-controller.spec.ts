import { Invoker } from "src/invoker";

//#region Mock express module
const mockApp = {
  use: vi.fn().mockReturnThis(),
  all: vi.fn().mockReturnThis(),
  listen: vi.fn((_, callback) => {
    callback?.();
    return { close: vi.fn() };
  }),
};

vi.mock("express", () => ({
  default: vi.fn(() => mockApp),
}));
//#endregion

vi.mock("../../src/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

vi.mock("../../src/invoker", () => ({
  Invoker: vi.fn(function (this: Invoker) {
    this.httpInvoke = vi.fn().mockResolvedValue({
      statusCode: 200,
      body: "test response",
    });
  }),
}));

vi.mock("../../src/config", () => ({
  config: {
    port: 3000,
    getFunctionByPath: vi.fn().mockReturnValue("test-function"),
    getCorsAllowOrigin: vi.fn().mockReturnValue([]),
    isFunctionOnV1HttpRequestPayload: vi.fn().mockReturnValue(false),
  },
}));

describe("HttpController", () => {
  beforeEach(vi.clearAllMocks);

  afterEach(vi.resetModules);

  describe("init()", () => {
    it("should start server on configured port", async () => {
      const { HttpController } = await import(
        "../../src/controller/http-controller"
      );
      const { config } = await import("../../src/config");
      const { logger } = await import("../../src/logger");

      const controller = new HttpController();
      controller.init();

      expect(mockApp.listen).toHaveBeenCalledWith(
        config.port,
        expect.any(Function),
      );
      expect(logger.info).toHaveBeenCalledWith(
        `HttpController is listening on port ${config.port}`,
      );
    });

    it("should configure middleware", async () => {
      const { HttpController } = await import(
        "../../src/controller/http-controller"
      );

      const controller = new HttpController();
      controller.init();

      expect(mockApp.use).toHaveBeenCalled();
      expect(mockApp.all).toHaveBeenCalledWith("*", expect.any(Function));
    });
  });
});
