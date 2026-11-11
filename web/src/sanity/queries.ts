import { type ComponentProps } from "react";
import { defineQuery, PortableText } from "next-sanity";

export type KnowledgeBaseArticleSummary = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  categories?: ({ _id: string; title?: string } | null)[];
};

export type KnowledgeBaseArticle = {
  _id: string;
  title: string;
  excerpt?: string;
  author?: string;
  publishedAt?: string;
  body?: ComponentProps<typeof PortableText>["value"];
};

export const KNOWLEDGE_BASE_ARTICLES_QUERY = defineQuery(`
  *[_type == "article" && defined(slug.current)] | order(publishedAt desc, _createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    "categories": categories[]->{_id, title}
  }
`);

export const KNOWLEDGE_BASE_ARTICLE_QUERY = defineQuery(`
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    title,
    excerpt,
    body,
    author,
    publishedAt,
    "categories": categories[]->{_id, title}
  }
`);
