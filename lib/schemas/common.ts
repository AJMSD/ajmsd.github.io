import { z } from "zod";

export const LinkTypeSchema = z.enum([
  "repo",
  "demo",
  "paper",
  "video",
  "website",
  "social",
  "resume",
  "other"
]);

export const UrlOrPathSchema = z
  .string()
  .min(1)
  .refine((value) => value.startsWith("/") || /^https?:\/\//.test(value), {
    message: "Expected an absolute URL or app-relative path."
  });

export const LinkSchema = z.object({
  type: LinkTypeSchema,
  label: z.string().min(1),
  url: UrlOrPathSchema
});

export const DateRangeFieldsSchema = z.object({
  start_date: z.string().min(4),
  end_date: z.string().min(4).optional(),
  present: z.boolean().optional()
});
