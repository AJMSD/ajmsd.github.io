import { CanonicalContent } from "@/lib/content/load";
import { MaterializedKind, MaterializedRecordInput } from "@/lib/db/materialized-content";

type MaterializedPayload = Record<MaterializedKind, MaterializedRecordInput[]>;

export function toMaterializedPayload(content: CanonicalContent): MaterializedPayload {
  const lors = content.lors.map((record, index) => ({
    recordId: record.id,
    priority: index,
    payload: record
  }));

  const story = content.story.map((record) => ({
    recordId: record.id,
    priority: record.priority,
    payload: record
  }));

  const gameQuestionBank = content.game_question_bank.map((question) => ({
    recordId: question.id,
    priority: question.difficulty,
    payload: question
  }));

  return {
    work: content.work.map((record) => ({
      recordId: record.id,
      priority: record.priority,
      startDate: record.start_date,
      endDate: record.end_date,
      payload: record
    })),
    projects: content.projects.map((record) => ({
      recordId: record.id,
      priority: record.priority,
      startDate: record.start_date,
      endDate: record.end_date,
      payload: record
    })),
    education: content.education.map((record) => ({
      recordId: record.id,
      priority: record.priority,
      startDate: record.start_date,
      endDate: record.end_date,
      payload: record
    })),
    about: [
      {
        recordId: "about",
        priority: 0,
        payload: content.about
      }
    ],
    lors,
    story,
    links: [
      {
        recordId: "links",
        priority: 0,
        payload: content.links
      }
    ],
    game_question_bank: gameQuestionBank
  };
}
