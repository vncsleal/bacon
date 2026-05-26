import { createAuth } from "@repo/database/convex/auth";
import { api } from "@repo/database/convex/_generated/api";
import { getToken } from "@convex-dev/better-auth/nextjs";
import { fetchQuery } from "convex/nextjs";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { env } from "@/env";
import { AvatarStack } from "./components/avatar-stack";
import { Cursors } from "./components/cursors";
import { Header } from "./components/header";

const title = "Acme Inc";
const description = "My application.";

const CollaborationProvider = dynamic(() =>
  import("./components/collaboration-provider").then(
    (mod) => mod.CollaborationProvider
  )
);

export const metadata: Metadata = {
  title,
  description,
};

// Demo pages — replace with your own Convex data model after `npx convex dev`.
// Example: const pages = await fetchQuery(api.pages.listAll, {}, { token });
const DEMO_PAGES = [
  { _id: "demo-1", name: "Introduction" },
  { _id: "demo-2", name: "Getting Started" },
  { _id: "demo-3", name: "Configuration" },
];

const App = async () => {
  const pages = DEMO_PAGES;

  if (!env.NEXT_PUBLIC_CONVEX_URL) {
    notFound();
  }

  const token = await getToken(createAuth);
  const user = token ? await fetchQuery(api.auth.getCurrentUser, {}, { token }) : null;

  if (!user) {
    notFound();
  }

  return (
    <>
      <Header page="Data Fetching" pages={["Building Your Application"]}>
        {env.LIVEBLOCKS_SECRET && (
          <CollaborationProvider orgId={user._id as string}>
            <AvatarStack />
            <Cursors />
          </CollaborationProvider>
        )}
      </Header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {pages.map((page) => (
            <div className="aspect-video rounded-xl bg-muted/50" key={page._id}>
              {page.name}
            </div>
          ))}
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    </>
  );
};

export default App;
