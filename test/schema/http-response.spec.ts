import { isHttpResponse } from "../../src/schema/http-response";

describe("isHttpResponse()", () => {
  it("should return true for a valid HttpResponse", () => {
    const validResponse = {
      statusCode: 200,
      isBase64Encoded: false,
      body: "test",
      headers: { "Content-Type": "application/json" },
    };
    expect(isHttpResponse(validResponse)).toBe(true);
  });

  it("should return true for a minimal valid HttpResponse", () => {
    const minimalResponse = {
      statusCode: 200,
      isBase64Encoded: true,
      body: "",
    };
    expect(isHttpResponse(minimalResponse)).toBe(true);
  });

  it("should return false if data is null or undefined", () => {
    expect(isHttpResponse(null)).toBe(false);
    expect(isHttpResponse(undefined)).toBe(false);
  });

  it("should return false if data is not an object", () => {
    expect(isHttpResponse("string")).toBe(false);
    expect(isHttpResponse(123)).toBe(false);
    expect(isHttpResponse([])).toBe(false);
  });

  it("should return false if statusCode is missing", () => {
    const response = { isBase64Encoded: false, body: "test" };
    expect(isHttpResponse(response)).toBe(false);
  });

  it("should return false if statusCode is not a number", () => {
    const response = {
      statusCode: "200",
      isBase64Encoded: false,
      body: "test",
    };
    expect(isHttpResponse(response)).toBe(false);
  });

  it("should return false if isBase64Encoded is missing", () => {
    const response = { statusCode: 200, body: "test" };
    expect(isHttpResponse(response)).toBe(false);
  });

  it("should return false if isBase64Encoded is not a boolean", () => {
    const response = {
      statusCode: 200,
      isBase64Encoded: "false",
      body: "test",
    };
    expect(isHttpResponse(response)).toBe(false);
  });

  it("should return false if body is missing", () => {
    const response = { isBase64Encoded: true, statusCode: 200 };
    expect(isHttpResponse(response)).toBe(false);
  });

  it("should return false if body is not string", () => {
    const response = {
      statusCode: 200,
      isBase64Encoded: true,
      body: { some: "invalid-body" },
    };
    expect(isHttpResponse(response)).toBe(false);
  });

  it("should return false if headers contain non-string values", () => {
    const response = {
      statusCode: 200,
      isBase64Encoded: false,
      headers: { "Content-Type": 123 },
    };
    expect(isHttpResponse(response)).toBe(false);
  });
});
