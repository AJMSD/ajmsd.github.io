import { readFile } from "fs/promises";
import path from "path";
import {
  AboutFileSchema,
  EducationFileSchema,
  LinksFileSchema,
  LorsFileSchema,
  ProjectsFileSchema,
  StoryFileSchema,
  WorkFileSchema
} from "@/lib/schemas/content";
import { GameQuestionBankFileSchema } from "@/lib/schemas/game-question";

const CONTENT_DIR = path.join(process.cwd(), "content");

const CONTENT_FILES = {
  work: "work.json",
  projects: "projects.json",
  education: "education.json",
  about: "about.json",
  lors: "lors.json",
  story: "story.json",
  links: "links.json",
  game_question_bank: "game_question_bank.json"
} as const;

export type CanonicalContent = {
  work: ReturnType<typeof WorkFileSchema.parse>;
  projects: ReturnType<typeof ProjectsFileSchema.parse>;
  education: ReturnType<typeof EducationFileSchema.parse>;
  about: ReturnType<typeof AboutFileSchema.parse>;
  lors: ReturnType<typeof LorsFileSchema.parse>;
  story: ReturnType<typeof StoryFileSchema.parse>;
  links: ReturnType<typeof LinksFileSchema.parse>;
  game_question_bank: ReturnType<typeof GameQuestionBankFileSchema.parse>;
};

let canonicalContentCache: CanonicalContent | null = null;

export async function loadCanonicalContent(): Promise<CanonicalContent> {
  if (canonicalContentCache) {
    return canonicalContentCache;
  }

  const [workRaw, projectsRaw, educationRaw, aboutRaw, lorsRaw, storyRaw, linksRaw, gameRaw] =
    await Promise.all([
      readJsonFile(CONTENT_FILES.work),
      readJsonFile(CONTENT_FILES.projects),
      readJsonFile(CONTENT_FILES.education),
      readJsonFile(CONTENT_FILES.about),
      readJsonFile(CONTENT_FILES.lors),
      readJsonFile(CONTENT_FILES.story),
      readJsonFile(CONTENT_FILES.links),
      readJsonFile(CONTENT_FILES.game_question_bank)
    ]);

  const canonical: CanonicalContent = {
    work: WorkFileSchema.parse(workRaw),
    projects: ProjectsFileSchema.parse(projectsRaw),
    education: EducationFileSchema.parse(educationRaw),
    about: AboutFileSchema.parse(aboutRaw),
    lors: LorsFileSchema.parse(lorsRaw),
    story: StoryFileSchema.parse(storyRaw),
    links: LinksFileSchema.parse(linksRaw),
    game_question_bank: GameQuestionBankFileSchema.parse(gameRaw)
  };

  canonicalContentCache = {
    ...canonical,
    work: sortByPriorityDateId(canonical.work),
    projects: sortByPriorityDateId(canonical.projects),
    education: sortByPriorityDateId(canonical.education)
  };

  return canonicalContentCache;
}

export function clearCanonicalContentCache(): void {
  canonicalContentCache = null;
}

function sortByPriorityDateId<T extends { id: string; priority: number; start_date?: string }>(
  items: T[]
): T[] {
  return [...items].sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }

    const aDate = a.start_date ?? "";
    const bDate = b.start_date ?? "";
    if (aDate !== bDate) {
      return bDate.localeCompare(aDate);
    }

    return a.id.localeCompare(b.id);
  });
}

async function readJsonFile(fileName: string): Promise<unknown> {
  const filePath = path.join(CONTENT_DIR, fileName);
  const fileContent = await readFile(filePath, "utf8");
  return JSON.parse(fileContent);
}
