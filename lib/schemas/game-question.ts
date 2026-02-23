import { z } from "zod";

const HubSchema = z.enum(["origin", "ib_java", "systems", "research", "builder"]);
const QuestionTypeSchema = z.enum(["mcq_single", "short_text", "fill_blank", "code_fill"]);

const BaseQuestionSchema = z.object({
  id: z.string().min(1),
  hub: HubSchema,
  difficulty: z.number().int().min(1).max(3),
  type: QuestionTypeSchema,
  prompt: z.string().min(1).max(240),
  explanation: z.string().min(1).max(240),
  tags: z.array(z.string().min(1)),
  time_limit_s: z.number().int().min(10).max(60)
});

const McqSingleQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal("mcq_single"),
  choices: z.array(z.string().min(1)).min(3).max(5),
  answer: z.object({
    choice_index: z.number().int().min(0)
  })
});

const ShortTextQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal("short_text"),
  answer: z.object({
    accepted: z.array(z.string().min(1)).min(1).max(3),
    normalize: z.literal("lower_trim")
  })
});

const FillBlankQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal("fill_blank"),
  text: z.string().min(1),
  answer: z.object({
    blanks: z.array(z.array(z.string().min(1)).min(1)).min(1)
  })
});

const CodeFillQuestionSchema = BaseQuestionSchema.extend({
  type: z.literal("code_fill"),
  code: z.string().min(1),
  answer: z.object({
    blanks: z.array(z.array(z.string().min(1)).min(1).max(3)).min(1)
  })
});

export const GameQuestionSchema = z
  .discriminatedUnion("type", [
    McqSingleQuestionSchema,
    ShortTextQuestionSchema,
    FillBlankQuestionSchema,
    CodeFillQuestionSchema
  ])
  .superRefine((question, ctx) => {
    if (question.type === "mcq_single" && question.answer.choice_index >= question.choices.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["answer", "choice_index"],
        message: "choice_index must reference an existing choice."
      });
    }

    if (question.type === "short_text") {
      question.answer.accepted.forEach((value, index) => {
        if (/\s/.test(value.trim())) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["answer", "accepted", index],
            message: "short_text accepted answers must be one token only."
          });
        }
      });
    }
  });

export const GameQuestionBankFileSchema = z.array(GameQuestionSchema);
