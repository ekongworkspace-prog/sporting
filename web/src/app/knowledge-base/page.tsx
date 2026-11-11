import Link from "next/link";
import { client } from "@/sanity/client";
import {
  KNOWLEDGE_BASE_ARTICLES_QUERY,
  type KnowledgeBaseArticleSummary,
} from "@/sanity/queries";

export const metadata = {
  title: "Knowledge Base",
  description: "Guides and answers for the Turfing football community.",
};

export default async function KnowledgeBasePage() {
  const articles = await client.fetch<KnowledgeBaseArticleSummary[]>(
    KNOWLEDGE_BASE_ARTICLES_QUERY,
    {},
    { next: { revalidate: 60 } },
  );

  return (
    <main className="min-h-[60vh] bg-[#f7f8f4] px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-lime-700">
          Turfing support
        </p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-zinc-950">Knowledge Base</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600">
          Find answers, practical guides, and tips for getting the most out of Turfing.
        </p>

        {articles.length > 0 ? (
          <ul className="mt-10 grid gap-4">
            {articles.map((article) => (
              <li key={article._id}>
                <Link
                  className="block rounded-2xl border border-zinc-200 bg-white p-6 transition hover:border-lime-500"
                  href={`/knowledge-base/${article.slug}`}
                >
                  <h2 className="text-xl font-bold text-zinc-950">{article.title}</h2>
                  {article.excerpt && (
                    <p className="mt-2 leading-7 text-zinc-600">{article.excerpt}</p>
                  )}
                  {article.categories && article.categories.length > 0 && (
                    <p className="mt-4 text-sm font-semibold text-lime-700">
                      {article.categories
                        .map((category) => category?.title)
                        .filter(Boolean)
                        .join(" | ")}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-10 rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-zinc-600">
            No articles published yet. Add your first article in the Sanity Studio.
          </p>
        )}
      </div>
    </main>
  );
}
