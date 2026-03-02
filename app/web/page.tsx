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
      className={`${webHeadingFont.variable} ${webMonoFont.variable} relative min-h-screen overflow-x-clip bg-[#041523] text-[#f8f3ea]`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(80,216,255,0.2)_0%,_transparent_45%),radial-gradient(circle_at_80%_15%,_rgba(255,156,82,0.18)_0%,_transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(4,21,35,0.8)_0%,rgba(4,21,35,0.95)_50%,rgba(4,21,35,1)_100%)]" />

      <div
        className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 pb-20 pt-6 sm:px-6 lg:px-8"
        style={{ fontFamily: "var(--font-web-heading)" }}
      >
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
