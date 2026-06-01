import type { ReactNode } from "react";
import type {
  CmsDataPort,
  CmsUiComponents,
  LegalPost,
  LegalPostMeta,
  Post,
  PostMeta,
} from "./port";

const FIXTURE_POSTS: Post[] = [
  {
    _slug: "welcome-to-bacon",
    _title: "Welcome to bacon",
    authors: [
      {
        _title: "bacon Team",
        avatar: null,
        xUrl: null,
      },
    ],
    categories: [{ _title: "Announcements" }],
    date: "2026-01-01",
    description:
      "A production-grade B2B SaaS starter built with Next.js, Convex, and Better Auth.",
    image: {
      url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
      width: 800,
      height: 600,
      alt: "Code editor with syntax highlighting",
    },
    body: {
      plainText:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      json: {
        content: [
          {
            __typename: "HeadingNode",
            level: 1,
            children: [{ text: "Introduction" }],
          },
          {
            __typename: "ParagraphNode",
            children: [
              {
                text: "Welcome to bacon — a production-grade B2B SaaS starter.",
              },
            ],
          },
        ],
        toc: [
          { id: "introduction", text: "Introduction", depth: 1 },
          { id: "getting-started", text: "Getting Started", depth: 2 },
        ],
      },
      readingTime: 3,
    },
  },
  {
    _slug: "setting-up-authentication",
    _title: "Setting Up Authentication",
    authors: [
      {
        _title: "bacon Team",
        avatar: null,
        xUrl: null,
      },
    ],
    categories: [{ _title: "Guides" }],
    date: "2026-01-15",
    description:
      "Learn how to configure Better Auth with email/password and OAuth providers.",
    image: {
      url: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800",
      width: 800,
      height: 600,
      alt: "Security lock icon on a gradient background",
    },
    body: {
      plainText:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      json: {
        content: [
          {
            __typename: "HeadingNode",
            level: 1,
            children: [{ text: "Authentication Setup" }],
          },
          {
            __typename: "ParagraphNode",
            children: [
              { text: "Configure Better Auth with email and OAuth providers." },
            ],
          },
        ],
        toc: [
          { id: "overview", text: "Overview", depth: 1 },
          { id: "configuration", text: "Configuration", depth: 2 },
        ],
      },
      readingTime: 5,
    },
  },
  {
    _slug: "deploying-to-production",
    _title: "Deploying to Production",
    authors: [
      {
        _title: "bacon Team",
        avatar: null,
        xUrl: null,
      },
    ],
    categories: [{ _title: "Deployment" }],
    date: "2026-02-01",
    description:
      "Step-by-step guide to deploying bacon to Vercel with all service integrations.",
    image: {
      url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
      width: 800,
      height: 600,
      alt: "Dashboard analytics on a laptop screen",
    },
    body: {
      plainText:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      json: {
        content: [
          {
            __typename: "HeadingNode",
            level: 1,
            children: [{ text: "Deployment Guide" }],
          },
          {
            __typename: "ParagraphNode",
            children: [
              { text: "Deploy bacon to Vercel with all integrations." },
            ],
          },
        ],
        toc: [
          { id: "prerequisites", text: "Prerequisites", depth: 1 },
          { id: "deployment", text: "Deployment", depth: 2 },
        ],
      },
      readingTime: 7,
    },
  },
];

const FIXTURE_LEGAL_PAGES: LegalPost[] = [
  {
    _slug: "privacy-policy",
    _title: "Privacy Policy",
    description:
      "Our privacy policy outlines how we collect, use, and protect your data.",
    body: {
      plainText:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      json: {
        content: [
          {
            __typename: "HeadingNode",
            level: 1,
            children: [{ text: "Information We Collect" }],
          },
        ],
        toc: [
          {
            id: "information-we-collect",
            text: "Information We Collect",
            depth: 1,
          },
          { id: "how-we-use-it", text: "How We Use It", depth: 2 },
        ],
      },
      readingTime: 4,
    },
  },
  {
    _slug: "terms-of-service",
    _title: "Terms of Service",
    description:
      "These terms govern your use of the bacon platform and services.",
    body: {
      plainText:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      json: {
        content: [
          {
            __typename: "HeadingNode",
            level: 1,
            children: [{ text: "Acceptance of Terms" }],
          },
        ],
        toc: [
          { id: "acceptance", text: "Acceptance of Terms", depth: 1 },
          { id: "user-obligations", text: "User Obligations", depth: 2 },
        ],
      },
      readingTime: 6,
    },
  },
];

interface FixtureShape {
  readonly blog: {
    readonly posts: {
      readonly items: PostMeta[];
      readonly item: Post | null;
    };
  };
  readonly legalPages: {
    readonly items: LegalPostMeta[];
    readonly item: LegalPost | null;
  };
}

const buildFixture = (): FixtureShape => ({
  blog: {
    posts: {
      items: FIXTURE_POSTS.map(({ body: _body, ...rest }) => rest),
      item: FIXTURE_POSTS[0] ?? null,
    },
  },
  legalPages: {
    items: FIXTURE_LEGAL_PAGES.map(({ body: _body, ...rest }) => rest),
    item: FIXTURE_LEGAL_PAGES[0] ?? null,
  },
});

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: local rich text renderer handles multiple node types recursively
const LocalBody = ({ content }: { readonly content: unknown[] }) => {
  const renderNode = (node: unknown): ReactNode => {
    if (typeof node !== "object" || node === null) {
      return null;
    }

    const n = node as Record<string, unknown>;

    if (n.__typename === "HeadingNode") {
      // biome-ignore lint/style/noNestedTernary: three-level heading mapping, lookup table would be identical complexity
      const Tag = n.level === 1 ? "h1" : n.level === 2 ? "h2" : "h3";
      const children_ = Array.isArray(n.children)
        ? n.children.map(renderNode)
        : null;

      return <Tag>{children_}</Tag>;
    }

    if (n.__typename === "ParagraphNode") {
      const children_ = Array.isArray(n.children)
        ? n.children.map(renderNode)
        : null;

      return <p>{children_}</p>;
    }

    if (typeof n.text === "string") {
      return n.text;
    }

    return null;
  };

  return <>{content.map(renderNode)}</>;
};

const LocalImage = ({
  src,
  width,
  height,
  alt,
}: {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
}) => (
  // biome-ignore lint/performance/noImgElement: local adapter avoids framework-specific imports
  <img
    alt={alt}
    height={height}
    src={src}
    style={{ maxWidth: "100%", height: "auto" }}
    width={width}
  />
);

export const createLocalCmsUi = (): CmsUiComponents => ({
  Feed: async ({
    children,
  }: {
    queries: readonly unknown[];
    children: (data: readonly unknown[]) => ReactNode | Promise<ReactNode>;
  }) => {
    const result = children([buildFixture()]);
    return result instanceof Promise ? await result : result;
  },

  Toolbar: () => null,
  Image: LocalImage,
  Body: LocalBody,
});

export const createLocalCmsData = (): CmsDataPort => ({});
