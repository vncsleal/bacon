import type { ReactNode } from "react";

export type PostMetaCategories = readonly { readonly _title: string }[];

export type PostMetaAuthors = readonly {
  readonly _title: string;
  readonly avatar: unknown;
  readonly xUrl: string | null;
}[];

export interface PostMetaImage {
  readonly alt: string | null;
  readonly height: number;
  readonly url: string;
  readonly width: number;
}

export interface PostMeta {
  readonly _slug: string;
  readonly _title: string;
  readonly authors: PostMetaAuthors;
  readonly categories: PostMetaCategories;
  readonly date: string;
  readonly description: string;
  readonly image: PostMetaImage | null;
}

export interface PostTocEntry {
  readonly depth: number;
  readonly id: string;
  readonly text: string;
}

export type Post = PostMeta & {
  readonly body: {
    readonly plainText: string;
    readonly json: {
      readonly content: unknown[];
      readonly toc: readonly PostTocEntry[];
    };
    readonly readingTime: number;
  };
};

export interface LegalPostMeta {
  readonly _slug: string;
  readonly _title: string;
  readonly description: string;
}

export type LegalPost = LegalPostMeta & {
  readonly body: {
    readonly plainText: string;
    readonly json: {
      readonly content: unknown[];
      readonly toc: readonly PostTocEntry[];
    };
    readonly readingTime: number;
  };
};

// Feed query fragments always include image — guaranteed by the fragment shape.
// Null would mean the fragment itself returned null, which basehub doesn't do
// when the field is selected.
export interface BlogFeedItem {
  readonly _slug: string;
  readonly _title: string;
  readonly date: string;
  readonly description: string;
  readonly image: PostMetaImage;
}

// Feed query fragments always include image — guaranteed by the fragment shape.
export type BlogFeedItemDetail = Post & {
  readonly image: PostMetaImage;
};

export interface BlogFeedQueryResult {
  readonly blog: {
    readonly posts: {
      readonly items: readonly BlogFeedItem[];
      readonly item: BlogFeedItemDetail | null;
    };
  };
}

export interface LegalFeedQueryResult {
  readonly legalPages: {
    readonly items: readonly LegalPostMeta[];
    readonly item: LegalPost | null;
  };
}

export interface FeedProps {
  children: (data: readonly unknown[]) => ReactNode | Promise<ReactNode>;
  queries: readonly unknown[];
}

export interface ImageProps {
  readonly alt: string;
  readonly className?: string;
  readonly height: number;
  readonly priority?: boolean;
  readonly src: string;
  readonly width: number;
}

export interface CmsUiComponents {
  readonly Body: (props: {
    readonly content: unknown[];
    readonly components?: Record<string, unknown>;
  }) => ReactNode;
  readonly Feed: (props: FeedProps) => Promise<ReactNode>;
  readonly Image: (props: ImageProps) => ReactNode;
  readonly Toolbar: () => null;
}

// Data queries are handled by the existing index.ts which already guards
// against missing BASEHUB_TOKEN (returns empty arrays / null). No adapter
// needed — the data layer doesn't crash without credentials.
export type CmsDataPort = Record<string, never>;
