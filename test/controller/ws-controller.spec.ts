import type { Server } from "node:http";
import { Invoker } from "src/invoker";

//#region express module
const mockServer = {
  listen: vi.fn((_, callback) => {
    callback?.();
    return {} as Server;
  }),
  listening: true,
  on: vi.fn(),
  close: vi.fn((callback) => callback?.()),
};

const mockApp = {
  use: vi.fn().mockReturnThis(),
  post: vi.fn().mockReturnThis(),
};

vi.mock("express", () => ({
  default: Object.assign(
    vi.fn(() => mockApp),
    {
      raw: vi.fn(() => vi.fn()),
    },
  ),
}));
//#endregion

vi.mock("node:http", () => ({
  createServer: vi.fn(() => mockServer),
}));

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
    this.wsInvoke = vi.fn().mockResolvedValue({});
  }),
}));

vi.mock("../../src/config", () => ({
  config: {
    port: 3000,
    wsFunction: "test-ws-function",
  },
}));

describe("WSController", () => {
  beforeEach(vi.clearAllMocks);

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("should construct without error even when wsFunction is not configured", async () => {
    const { WSController } = await import("../../src/controller/ws-controller");

    expect(() => {
      new WSController();
    }).not.toThrow();
  });

  describe("init()", () => {
    it("should start server on configured port + 1", async () => {
      const { WSController } =
        await import("../../src/controller/ws-controller");
      const { config } = await import("../../src/config");
      const { logger } = await import("../../src/logger");

      const controller = new WSController();
      controller.init();

      expect(mockServer.listen).toHaveBeenCalledWith(
        config.port + 1,
        expect.any(Function),
      );
      expect(logger.info).toHaveBeenCalledWith(
        `WSController is listening on port ${config.port + 1}`,
      );
    });

    it("should configure connection management endpoint", async () => {
      const { WSController } =
        await import("../../src/controller/ws-controller");

      const controller = new WSController();
      controller.init();

      expect(mockApp.post).toHaveBeenCalledWith(
        "/:stage/@connections/:connectionId",
        expect.any(Function),
      );
    });

    it("should warn on init when WS_FUNCTION is not configured", async () => {
      // Override config.wsFunction to undefined
      const { config } = await import("../../src/config");
      Object.defineProperty(config, "wsFunction", { value: undefined });

      const { WSController } =
        await import("../../src/controller/ws-controller");
      const { logger } = await import("../../src/logger");

      const controller = new WSController();
      controller.init();

      expect(logger.warn).toHaveBeenCalledWith(
        "WebSocket function is not configured - WebSocket functionality disabled",
      );
    });
  });

  describe("shutdown()", () => {
    it("should close server and log shutdown messages", async () => {
      const { WSController } =
        await import("../../src/controller/ws-controller");
      const { logger } = await import("../../src/logger");

      const controller = new WSController();
      controller.init(); // Initialize to create server
      controller.shutdown();

      expect(logger.info).toHaveBeenCalledWith("WSController shutting down...");
      expect(mockServer.close).toHaveBeenCalled();
    });

    it("should handle shutdown when server is not initialized", async () => {
      mockServer.listening = false; // Simulate server not started
      const { WSController } =
        await import("../../src/controller/ws-controller");
      const { logger } = await import("../../src/logger");

      const controller = new WSController();
      // Skip initialization to keep server in non-listening state
      controller.shutdown();

      expect(logger.info).not.toHaveBeenCalled();
      expect(mockServer.close).not.toHaveBeenCalled();
    });
  });
});
