import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import { client } from "@/sanity/client";
import { KNOWLEDGE_BASE_ARTICLE_QUERY, type KnowledgeBaseArticle } from "@/sanity/queries";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await client.fetch<KnowledgeBaseArticle | null>(
    KNOWLEDGE_BASE_ARTICLE_QUERY,
    { slug },
    { next: { revalidate: 60 } },
  );

  return article
    ? { title: article.title, description: article.excerpt }
    : { title: "Article not found" };
}

export default async function KnowledgeBaseArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await client.fetch<KnowledgeBaseArticle | null>(
    KNOWLEDGE_BASE_ARTICLE_QUERY,
    { slug },
    { next: { revalidate: 60 } },
  );

  if (!article) notFound();

  return (
    <main className="min-h-[60vh] bg-[#f7f8f4] px-6 py-16">
      <article className="mx-auto max-w-3xl">
        <Link
          className="text-sm font-bold text-lime-700 hover:text-lime-900"
          href="/knowledge-base"
        >
          Back to Knowledge Base
        </Link>
        <h1 className="mt-6 text-4xl font-black tracking-tight text-zinc-950">{article.title}</h1>
        {article.excerpt && (
          <p className="mt-4 text-lg leading-8 text-zinc-600">{article.excerpt}</p>
        )}
        {(article.author || article.publishedAt) && (
          <p className="mt-5 text-sm text-zinc-500">
            {article.author}
            {article.author && article.publishedAt ? " | " : ""}
            {article.publishedAt && new Date(article.publishedAt).toLocaleDateString()}
          </p>
        )}
        {article.body && (
          <div className="mt-10 space-y-5 leading-8 text-zinc-700 [&_a]:text-lime-700 [&_a]:underline [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-bold [&_ol]:list-decimal [&_ol]:pl-6 [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-6">
            <PortableText value={article.body} />
          </div>
        )}
      </article>
    </main>
  );
}
