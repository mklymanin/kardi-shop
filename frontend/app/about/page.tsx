import { FadeInSection } from "@/components/motion/fade-in-section";

export default function AboutPage() {
  return (
    <FadeInSection className="mx-auto max-w-4xl px-6 py-12" amount={0.1}>
      <h1 className="text-4xl font-semibold">О компании</h1>
      <p className="text-ink/70 mt-4">
        Информация о компании, условиях работы и сервисной поддержке.
      </p>
    </FadeInSection>
  );
}
