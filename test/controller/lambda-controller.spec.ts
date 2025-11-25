import { Invoker } from "src/invoker";

//#region Mock express module
const mockApp = {
  use: vi.fn().mockReturnThis(),
  post: vi.fn().mockReturnThis(),
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
    this.getUrl = vi
      .fn()
      .mockReturnValue(new URL("http://test-function:8080/invoke"));
  }),
}));

vi.mock("../../src/config", () => ({
  config: {
    port: 3000,
  },
}));

vi.mock("../../src/throttle", () => ({
  throttle: {
    add: vi.fn((_name, task) => task()),
  },
}));

vi.mock("http-proxy", () => ({
  createProxyServer: vi.fn().mockReturnValue({
    web: vi.fn(),
    close: vi.fn(),
  }),
}));

describe("LambdaController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetModules();
  });

  describe("init()", () => {
    it("should start server on configured port + 2", async () => {
      const { LambdaController } = await import(
        "../../src/controller/lambda-controller"
      );
      const { logger } = await import("../../src/logger");
      const { config } = await import("../../src/config");

      const controller = new LambdaController();
      controller.init();

      expect(mockApp.listen).toHaveBeenCalledWith(
        config.port + 2,
        expect.any(Function),
      );
      expect(logger.info).toHaveBeenCalledWith(
        `LambdaController is listening on port ${config.port + 2}`,
      );
    });

    it("should configure Lambda invocation endpoint", async () => {
      const { LambdaController } = await import(
        "../../src/controller/lambda-controller"
      );

      const controller = new LambdaController();
      controller.init();

      expect(mockApp.post).toHaveBeenCalledWith(
        "/2015-03-31/functions/:functionName/invocations",
        expect.any(Function),
      );
    });
  });
});
