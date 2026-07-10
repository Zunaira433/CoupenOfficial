import { describe, it, expect } from "vitest";
import {
  registerSchema,
  loginSchema,
  brandSchema,
  couponSchema,
  newsletterSchema
} from "@/lib/validation";

describe("registerSchema", () => {
  it("accepts valid input", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      password: "Password1",
      name: "Alice"
    });
    expect(result.success).toBe(true);
  });

  it("rejects weak password (no uppercase)", () => {
    const result = registerSchema.safeParse({ email: "a@b.com", password: "password1" });
    expect(result.success).toBe(false);
  });

  it("rejects password shorter than 8 chars", () => {
    const result = registerSchema.safeParse({ email: "a@b.com", password: "P1a" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = registerSchema.safeParse({ email: "not-an-email", password: "Password1" });
    expect(result.success).toBe(false);
  });

  it("lowercases the email", () => {
    const result = registerSchema.safeParse({ email: "TEST@EXAMPLE.COM", password: "Password1" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe("test@example.com");
  });
});

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    const result = loginSchema.safeParse({ email: "user@example.com", password: "anypassword" });
    expect(result.success).toBe(true);
  });

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({ email: "user@example.com", password: "" });
    expect(result.success).toBe(false);
  });
});

describe("brandSchema", () => {
  const valid = {
    name: "Nike",
    slug: "nike",
    websiteUrl: "https://nike.com",
    affiliateLink: "https://track.example.com/nike",
    categoryId: "clxxxxxxxxxxxxxxxxxxxxxxx",
    rating: 4.5
  };

  it("accepts valid brand", () => {
    expect(brandSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects slug with uppercase", () => {
    expect(brandSchema.safeParse({ ...valid, slug: "Nike" }).success).toBe(false);
  });

  it("rejects slug with spaces", () => {
    expect(brandSchema.safeParse({ ...valid, slug: "nike store" }).success).toBe(false);
  });

  it("rejects rating above 5", () => {
    expect(brandSchema.safeParse({ ...valid, rating: 6 }).success).toBe(false);
  });

  it("rejects invalid affiliate URL", () => {
    expect(brandSchema.safeParse({ ...valid, affiliateLink: "not-a-url" }).success).toBe(false);
  });
});

describe("couponSchema", () => {
  const valid = {
    title: "20% off everything",
    brandId: "clxxxxxxxxxxxxxxxxxxxxxxx",
    verified: false
  };

  it("accepts minimal coupon", () => {
    expect(couponSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts coupon with code and discount", () => {
    expect(couponSchema.safeParse({ ...valid, code: "SAVE20", discount: "20% OFF" }).success).toBe(true);
  });

  it("rejects empty title", () => {
    expect(couponSchema.safeParse({ ...valid, title: "" }).success).toBe(false);
  });
});

describe("newsletterSchema", () => {
  it("accepts valid email", () => {
    expect(newsletterSchema.safeParse({ email: "sub@example.com" }).success).toBe(true);
  });

  it("rejects invalid email", () => {
    expect(newsletterSchema.safeParse({ email: "not-email" }).success).toBe(false);
  });

  it("lowercases email", () => {
    const r = newsletterSchema.safeParse({ email: "SUB@EXAMPLE.COM" });
    if (r.success) expect(r.data.email).toBe("sub@example.com");
  });
});
