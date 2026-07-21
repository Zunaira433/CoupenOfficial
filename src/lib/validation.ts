import { z } from "zod";

// ---- Auth ----

export const registerSchema = z.object({
  name: z.string().trim().min(1).max(120).optional().or(z.literal("")),
  email: z.string().trim().toLowerCase().email().max(255),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(200)
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number")
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
  password: z.string().min(1).max(200)
});

// ---- Newsletter ----

export const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255)
});

// ---- Favorites ----

export const favoriteSchema = z.object({
  brandId: z.string().cuid()
});

// ---- Admin: Category ----

export const categorySchema = z.object({
  name: z.string().trim().min(1).max(120),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens only"),
  description: z.string().trim().max(2000).optional().or(z.literal(""))
});

// ---- Admin: Brand ----

export const brandSchema = z.object({
  name: z.string().trim().min(1).max(150),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(150)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens only"),
  logoUrl: z.string().trim().url().max(1000).optional().or(z.literal("")),
  description: z.string().trim().max(5000).optional().or(z.literal("")),
  websiteUrl: z.string().trim().url().max(1000),
  affiliateLink: z.string().trim().url().max(1000),
  metaTitle: z.string().trim().max(200).optional().or(z.literal("")),
  metaDesc: z.string().trim().max(300).optional().or(z.literal("")),
  categoryId: z.string().cuid(),
  rating: z.coerce.number().min(0).max(5).default(0)
});

export const brandUpdateSchema = brandSchema.partial();

// ---- Blog: Comments & Reactions ----

export const commentSchema = z.object({
  blogPostId: z.string().cuid(),
  body: z.string().trim().min(1, "Comment cannot be empty").max(2000)
});

export const commentReplySchema = z.object({
  adminReply: z.string().trim().min(1, "Reply cannot be empty").max(2000)
});

export const reactionSchema = z.object({
  blogPostId: z.string().cuid(),
  type: z.enum(["LIKE", "DISLIKE"])
});


// ---- Admin: Coupon ----

export const couponSchema = z.object({
  title: z.string().trim().min(1).max(200),
  code: z.string().trim().max(100).optional().or(z.literal("")),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  discount: z.string().trim().max(50).optional().or(z.literal("")),
  brandId: z.string().cuid(),
  verified: z.coerce.boolean().default(false),
  expiresAt: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? new Date(v) : null))
});

export const couponUpdateSchema = couponSchema.partial();

// ---- Admin: Review ----

export const reviewSchema = z.object({
  brandId: z.string().cuid(),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().trim().min(1).max(200),
  pros: z.array(z.string().trim().min(1).max(200)).max(20).default([]),
  cons: z.array(z.string().trim().min(1).max(200)).max(20).default([]),
  body: z.string().trim().min(1).max(10000)
});

export const reviewUpdateSchema = reviewSchema.partial();

// ---- Admin: Comparison ----

export const comparisonSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens only"),
  brandAId: z.string().cuid(),
  brandBId: z.string().cuid(),
  summary: z.string().trim().max(2000).optional().or(z.literal(""))
});

export const comparisonUpdateSchema = comparisonSchema.partial();

// ---- Admin: Blog ----

export const blogPostSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens only"),
  title: z.string().trim().min(1).max(200),
  excerpt: z.string().trim().max(500).optional().or(z.literal("")),
  content: z.string().trim().min(1).max(50000),
  coverUrl: z.string().trim().max(1000).optional().or(z.literal("")),
  metaTitle: z.string().trim().max(200).optional().or(z.literal("")),
  metaDesc: z.string().trim().max(300).optional().or(z.literal(""))
});

export const blogPostUpdateSchema = blogPostSchema.partial();

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255)
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(200)
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number")
});
