import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import {
  ChatbotWidgetShell,
  ContactSection,
  HeroSection,
  ProjectsGrid,
  SkillsMarquee,
  TabsSection,
  WebNavbar
} from "@/components/web";
import { loadCanonicalContent } from "@/lib/content/load";
import { getAbout, getEducation, getProjects, getWork } from "@/lib/portfolio/repository";

const webHeadingFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-web-heading"
});

const webMonoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-web-mono"
});

export default async function WebModePage() {
  const [aboutResult, workResult, projectsResult, educationResult, canonicalContent] =
    await Promise.all([
      getAbout(),
      getWork(),
      getProjects(),
      getEducation(),
      loadCanonicalContent()
    ]);

  const socialLinks = canonicalContent.links.social;

  return (
    <main
      className={`${webHeadingFont.variable} ${webMonoFont.variable} web-theme relative min-h-screen overflow-x-clip bg-[var(--web-bg)] text-[var(--web-text)]`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--web-bg-overlay-a)_0%,transparent_44%),radial-gradient(circle_at_80%_15%,var(--web-bg-overlay-b)_0%,transparent_52%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(31,18,9,0.68)_0%,rgba(31,18,9,0.9)_52%,rgba(31,18,9,1)_100%)]" />

      <div className="relative flex w-full flex-col pb-20 pt-6" style={{ fontFamily: "var(--font-web-heading)" }}>
        <WebNavbar />
        <HeroSection
          about={aboutResult.data}
          workCount={workResult.data.length}
          projectCount={projectsResult.data.length}
          educationCount={educationResult.data.length}
          socialLinks={socialLinks}
        />
        <TabsSection
          work={workResult.data}
          research={projectsResult.data}
          education={educationResult.data}
        />
        <SkillsMarquee skillsGrouped={aboutResult.data.skills_grouped} />
        <ProjectsGrid projects={projectsResult.data} />
        <ContactSection links={canonicalContent.links} />
      </div>

      <ChatbotWidgetShell />
    </main>
  );
}
