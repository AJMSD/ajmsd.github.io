import { z } from "zod";
import { DateRangeFieldsSchema, LinkSchema, UrlOrPathSchema } from "@/lib/schemas/common";

const BaseRecordSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  tags: z.array(z.string().min(1)),
  tech_stack: z.array(z.string().min(1)),
  links: z.array(LinkSchema),
  highlights: z.array(z.string().min(1)),
  priority: z.number().int().nonnegative()
});

const TimelineRecordSchema = BaseRecordSchema.merge(DateRangeFieldsSchema);

export const WorkRecordSchema = TimelineRecordSchema;
export const WorkFileSchema = z.array(WorkRecordSchema);

export const ProjectRecordSchema = TimelineRecordSchema.extend({
  description: z.string().min(1),
  is_deployed: z.boolean(),
  embed: z.object({
    allowed: z.boolean(),
    url: UrlOrPathSchema.optional()
  }),
  thumbnail_url: UrlOrPathSchema,
  category_tags: z.array(z.string().min(1))
}).superRefine((project, ctx) => {
  if (project.embed.allowed && !project.embed.url) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "embed.url is required when embed.allowed is true",
      path: ["embed", "url"]
    });
  }
});

export const ProjectsFileSchema = z.array(ProjectRecordSchema);

export const EducationRecordSchema = TimelineRecordSchema.extend({
  coursework: z.array(z.string().min(1)),
  achievements: z.array(z.string().min(1))
});

export const EducationFileSchema = z.array(EducationRecordSchema);

export const AboutFileSchema = z.object({
  professional: z.string().min(1),
  casual: z.string().min(1),
  skills_grouped: z.record(z.array(z.string().min(1)))
});

export const LorQuoteSchema = z.object({
  id: z.string().min(1),
  quote: z.string().min(1),
  author: z.string().min(1),
  context: z.string().min(1),
  permission_flag: z.boolean().optional()
});

export const LorsFileSchema = z.array(LorQuoteSchema);

export const StoryRecordSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  priority: z.number().int().nonnegative()
});

export const StoryFileSchema = z.array(StoryRecordSchema);

export const LinksFileSchema = z.object({
  social: z.array(LinkSchema),
  primary: z.array(LinkSchema)
});

export const CanonicalContentFilesSchema = z.object({
  work: WorkFileSchema,
  projects: ProjectsFileSchema,
  education: EducationFileSchema,
  about: AboutFileSchema,
  lors: LorsFileSchema,
  story: StoryFileSchema,
  links: LinksFileSchema
});
