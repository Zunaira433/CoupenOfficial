import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock env before importing csrf
vi.mock("@/lib/env", () => ({
  env: { SITE_URL: "https://coupenofficial.com" }
}));

const { isSameOriginRequest } = await import("@/lib/csrf");

function makeRequest(headers: Record<string, string>): Request {
  return new Request("https://coupenofficial.com/api/test", { method: "POST", headers });
}

describe("isSameOriginRequest", () => {
  beforeEach(() => {
    process.env.NODE_ENV = "production";
  });

  it("allows same-origin request", () => {
    const req = makeRequest({ origin: "https://coupenofficial.com" });
    expect(isSameOriginRequest(req)).toBe(true);
  });

  it("blocks different origin", () => {
    const req = makeRequest({ origin: "https://evil.com" });
    expect(isSameOriginRequest(req)).toBe(false);
  });

  it("blocks no origin in production", () => {
    const req = makeRequest({});
    expect(isSameOriginRequest(req)).toBe(false);
  });

  it("falls back to Referer header", () => {
    const req = makeRequest({ referer: "https://coupenofficial.com/login" });
    expect(isSameOriginRequest(req)).toBe(true);
  });
});
