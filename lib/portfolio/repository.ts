import {
  AboutFileSchema,
  EducationFileSchema,
  LorsFileSchema,
  ProjectsFileSchema,
  WorkFileSchema
} from "@/lib/schemas/content";
import { listKind } from "@/lib/db/materialized-content";
import { CanonicalContent, loadCanonicalContent } from "@/lib/content/load";

type SourceType = "db" | "file";

type RepositoryResult<TData> = {
  data: TData;
  source: SourceType;
};

export async function getWork(): Promise<RepositoryResult<CanonicalContent["work"]>> {
  const fallback = (await loadCanonicalContent()).work;
  const rows = await readRows("work");
  if (!rows) {
    return { data: fallback, source: "file" };
  }
  try {
    return { data: WorkFileSchema.parse(rows), source: "db" };
  } catch {
    return { data: fallback, source: "file" };
  }
}

export async function getProjects(): Promise<RepositoryResult<CanonicalContent["projects"]>> {
  const fallback = (await loadCanonicalContent()).projects;
  const rows = await readRows("projects");
  if (!rows) {
    return { data: fallback, source: "file" };
  }
  try {
    return { data: ProjectsFileSchema.parse(rows), source: "db" };
  } catch {
    return { data: fallback, source: "file" };
  }
}

export async function getEducation(): Promise<RepositoryResult<CanonicalContent["education"]>> {
  const fallback = (await loadCanonicalContent()).education;
  const rows = await readRows("education");
  if (!rows) {
    return { data: fallback, source: "file" };
  }
  try {
    return { data: EducationFileSchema.parse(rows), source: "db" };
  } catch {
    return { data: fallback, source: "file" };
  }
}

export async function getAbout(): Promise<RepositoryResult<CanonicalContent["about"]>> {
  const fallback = (await loadCanonicalContent()).about;
  const rows = await readRows("about");
  if (!rows || rows.length === 0) {
    return { data: fallback, source: "file" };
  }
  try {
    return { data: AboutFileSchema.parse(rows[0]), source: "db" };
  } catch {
    return { data: fallback, source: "file" };
  }
}

export async function getLors(): Promise<RepositoryResult<CanonicalContent["lors"]>> {
  const fallback = (await loadCanonicalContent()).lors;
  const rows = await readRows("lors");
  if (!rows) {
    return { data: fallback, source: "file" };
  }
  try {
    return { data: LorsFileSchema.parse(rows), source: "db" };
  } catch {
    return { data: fallback, source: "file" };
  }
}

export async function getSummary(): Promise<
  RepositoryResult<{
    counts: {
      work: number;
      projects: number;
      education: number;
      lors: number;
    };
    featured_projects: Array<{
      id: string;
      title: string;
      priority: number;
      is_deployed: boolean;
      category_tags: string[];
    }>;
  }>
> {
  const [work, projects, education, lors] = await Promise.all([
    getWork(),
    getProjects(),
    getEducation(),
    getLors()
  ]);

  return {
    source: combineSources([work.source, projects.source, education.source, lors.source]),
    data: {
      counts: {
        work: work.data.length,
        projects: projects.data.length,
        education: education.data.length,
        lors: lors.data.length
      },
      featured_projects: projects.data.slice(0, 3).map((project) => ({
        id: project.id,
        title: project.title,
        priority: project.priority,
        is_deployed: project.is_deployed,
        category_tags: project.category_tags
      }))
    }
  };
}

async function readRows(kind: "work" | "projects" | "education" | "about" | "lors") {
  try {
    const rows = await listKind(kind);
    if (rows.length === 0) {
      return null;
    }
    return rows.map((row) => row.payload);
  } catch {
    return null;
  }
}

function combineSources(sources: SourceType[]): SourceType {
  return sources.every((source) => source === "db") ? "db" : "file";
}
