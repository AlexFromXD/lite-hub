import {
  isHttpResponse,
  isInferableHttpResponse,
  newInferredHttpResponse,
} from "../../src/schema/http-response";

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

describe("isInferableHttpResponse()", () => {
  it("should return false if data has statusCode field", () => {
    const data = { statusCode: 200, body: "test" };
    expect(isInferableHttpResponse(data)).toBe(false);
  });

  it("should return true for an object without statusCode", () => {
    const data = { message: "Hello, World!" };
    expect(isInferableHttpResponse(data)).toBe(true);
  });
  it("should return true for a valid JSON string", () => {
    const data = JSON.stringify({ message: "Hello, World!" });
    expect(isInferableHttpResponse(data)).toBe(true);
  });

  it("should return true for a plain string", () => {
    const data = "Just a plain string";
    expect(isInferableHttpResponse(data)).toBe(true);
  });
});

describe("newInferredHttpResponse()", () => {
  it("should create a valid HttpResponse from an object body", () => {
    const body = { message: "Hello, World!" };
    const response = newInferredHttpResponse(body);
    expect(response).toEqual({
      statusCode: 200,
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
      isBase64Encoded: false,
    });
  });

  it("should create a valid HttpResponse from a string body", () => {
    const body = "Plain string body";
    const response = newInferredHttpResponse(body);
    expect(response).toEqual({
      statusCode: 200,
      body: body,
      headers: { "Content-Type": "application/json" },
      isBase64Encoded: false,
    });
  });
});
