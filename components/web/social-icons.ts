import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const SOCIAL_ICON_BY_LABEL: Record<string, IconDefinition> = {
  github: faGithub,
  linkedin: faLinkedin
};

export function getSocialIcon(label: string): IconDefinition | null {
  return SOCIAL_ICON_BY_LABEL[label.trim().toLowerCase()] ?? null;
}
