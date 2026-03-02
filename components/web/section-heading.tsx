type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <header className="space-y-2">
      <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/75">{eyebrow}</p>
      <h2 className="text-2xl font-semibold tracking-tight text-[#fff8ea] sm:text-3xl">{title}</h2>
      <p className="max-w-3xl text-sm leading-6 text-[#b7c8d6] sm:text-base">{description}</p>
    </header>
  );
}
