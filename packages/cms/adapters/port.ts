import type { ReactNode } from "react";

export type PostMetaCategories = readonly { readonly _title: string }[];

export type PostMetaAuthors = readonly {
  readonly _title: string;
  readonly avatar: unknown;
  readonly xUrl: string | null;
}[];

export type PostMetaImage = {
  readonly url: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string | null;
};

export type PostMeta = {
  readonly _slug: string;
  readonly _title: string;
  readonly authors: PostMetaAuthors;
  readonly categories: PostMetaCategories;
  readonly date: string;
  readonly description: string;
  readonly image: PostMetaImage | null;
};

export type PostTocEntry = {
  readonly id: string;
  readonly text: string;
  readonly depth: number;
};

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

export type LegalPostMeta = {
  readonly _slug: string;
  readonly _title: string;
  readonly description: string;
};

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

export type CmsUiComponents = {
  readonly Feed: (
    props: {
      queries: readonly unknown[];
      children: (data: readonly unknown[]) => Promise<ReactNode>;
    }
  ) => Promise<ReactNode>;
  readonly Toolbar: () => null;
};

export type CmsDataPort = Record<string, never>;
