import { z } from "zod";
import { LinkSchema } from "@/lib/schemas/common";
import {
  AboutFileSchema,
  EducationRecordSchema,
  LinksFileSchema,
  ProjectRecordSchema,
  WorkRecordSchema
} from "@/lib/schemas/content";

export type AboutContent = z.infer<typeof AboutFileSchema>;
export type WorkRecord = z.infer<typeof WorkRecordSchema>;
export type ProjectRecord = z.infer<typeof ProjectRecordSchema>;
export type EducationRecord = z.infer<typeof EducationRecordSchema>;
export type LinksContent = z.infer<typeof LinksFileSchema>;
export type LinkItem = z.infer<typeof LinkSchema>;
