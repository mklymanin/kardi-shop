import { getArticles } from "@/lib/strapi";

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-4xl font-semibold">Статьи и новости</h1>
      <div className="mt-8 grid gap-4">
        {articles.map((article) => (
          <article key={article.slug} className="rounded-[28px] border border-black/10 bg-white/75 p-6">
            <h2 className="text-2xl font-semibold">{article.title}</h2>
            <p className="mt-3 text-ink/70">{article.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
