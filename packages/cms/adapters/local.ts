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
      alt: "Code on a screen",
    },
    body: {
      plainText:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      json: {
        content: [],
        toc: [],
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
      url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
      width: 800,
      height: 600,
      alt: "Code on a screen",
    },
    body: {
      plainText:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      json: {
        content: [],
        toc: [],
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
      url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
      width: 800,
      height: 600,
      alt: "Code on a screen",
    },
    body: {
      plainText:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      json: {
        content: [],
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
        content: [],
        toc: [
          { id: "information-we-collect", text: "Information We Collect", depth: 1 },
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
        content: [],
        toc: [
          { id: "acceptance", text: "Acceptance of Terms", depth: 1 },
          { id: "user-obligations", text: "User Obligations", depth: 2 },
        ],
      },
      readingTime: 6,
    },
  },
];

type FixtureShape = {
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
};

const buildFixture = (): FixtureShape => ({
  blog: {
    posts: {
      items: FIXTURE_POSTS.map(
        ({ body: _body, ...rest }) => rest satisfies PostMeta
      ),
      item: FIXTURE_POSTS[0] ?? null,
    },
  },
  legalPages: {
    items: FIXTURE_LEGAL_PAGES.map(
      ({ body: _body, ...rest }) => rest satisfies LegalPostMeta
    ),
    item: FIXTURE_LEGAL_PAGES[0] ?? null,
  },
});

export const createLocalCmsUi = (): CmsUiComponents => ({
  Feed: async ({
    children,
  }: {
    queries: readonly unknown[];
    children: (data: readonly unknown[]) => Promise<ReactNode>;
  }) => children([buildFixture()]),

  Toolbar: () => null,
});

export const createLocalCmsData = (): CmsDataPort => ({});
