jest.mock("../src/logger", () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

beforeEach(() => {
  jest.resetModules(); // clear cache since config is singleton
});

describe("Config - Path Mapping", () => {
  const pathMapping = "PATH_MAPPING";

  it("should return undefined if no path mapping", async () => {
    const { config } = await import("../src/config");
    expect(config.getFunctionByPath("/")).toBeUndefined();
  });

  it("should return function name if path mapping exists", async () => {
    process.env[pathMapping] = "/a=a1,/a/b=a2,/a/b/c=a3,/b=b1";
    const { config } = await import("../src/config");
    expect(config.getFunctionByPath("/a")).toBe("a1");
    expect(config.getFunctionByPath("/a/b")).toBe("a2");
    expect(config.getFunctionByPath("/a/b/c")).toBe("a3");
    expect(config.getFunctionByPath("/b")).toBe("b1");
    expect(config.getFunctionByPath("/c")).toBeUndefined();
    expect(config.getFunctionByPath("/d")).toBeUndefined();
  });

  it("should return function name if path mapping exists (with wildcard)", async () => {
    process.env[pathMapping] = "/a=a1,/a/b=a2,/a/b/c=a3,/b=b1,/*=default";
    const { config } = await import("../src/config");
    expect(config.getFunctionByPath("/a")).toBe("a1");
    expect(config.getFunctionByPath("/a/b")).toBe("a2");
    expect(config.getFunctionByPath("/a/b/c")).toBe("a3");
    expect(config.getFunctionByPath("/b")).toBe("b1");
    expect(config.getFunctionByPath("/c")).toBe("default");
    expect(config.getFunctionByPath("/d")).toBe("default");
  });

  it("should log path mappings on initialization", async () => {
    process.env[pathMapping] = "/a=a1,/b=b1";
    process.env.FUNCTION_ENDPOINT =
      "a1=http://a1-endpoint,b1=http://b1-endpoint";
    const { logger } = await import("../src/logger");

    await import("../src/config");

    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining("/a => a1 (http://a1-endpoint)"),
    );
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining("/b => b1 (http://b1-endpoint)"),
    );
  });
});

describe("Config - isFunctionOnV1HttpRequestPayload()", () => {
  const functionEndpointEnvKey = "FUNCTION_ENDPOINT";
  const functionsOnV1PayloadEnvKey = "HTTP_V1_PAYLOAD_FUNCTIONS";

  afterEach(() => {
    delete process.env[functionEndpointEnvKey];
    delete process.env[functionsOnV1PayloadEnvKey];
  });

  it(`should return false if env ${functionsOnV1PayloadEnvKey} is NOT set`, async () => {
    process.env[functionEndpointEnvKey] = "fn-1=http://fn-1-endpoint:8080";
    const { config } = await import("../src/config");

    const result = config.isFunctionOnV1HttpRequestPayload("fn-1");

    expect(result).toBe(false);
  });

  it(`should return true if env ${functionsOnV1PayloadEnvKey} values contain function logical name in ${functionEndpointEnvKey}`, async () => {
    process.env[functionEndpointEnvKey] = "fn-1=http://fn-1-endpoint:8080";
    process.env[functionsOnV1PayloadEnvKey] = "fn-1";
    const { config } = await import("../src/config");

    const result = config.isFunctionOnV1HttpRequestPayload("fn-1");

    expect(result).toBe(true);
  });

  it(`should return false if NO env is set`, async () => {
    const { config } = await import("../src/config");

    const result = config.isFunctionOnV1HttpRequestPayload("fn-1");

    expect(result).toBe(false);
  });
});
