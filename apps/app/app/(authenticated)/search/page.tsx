import { redirect } from "next/navigation";
import { Header } from "../components/header";

// Demo pages — replace with your Convex search query after `npx convex dev`.
// Example: const pages = await fetchQuery(api.pages.search, { q }, { token });
const DEMO_PAGES = [
  { _id: "demo-1", name: "Introduction" },
  { _id: "demo-2", name: "Getting Started" },
  { _id: "demo-3", name: "Configuration" },
];

interface SearchPageProperties {
  searchParams: Promise<{
    q: string;
  }>;
}

export const generateMetadata = async ({
  searchParams,
}: SearchPageProperties) => {
  const { q } = await searchParams;

  return {
    title: `${q} - Search results`,
    description: `Search results for ${q}`,
  };
};

const SearchPage = async ({ searchParams }: SearchPageProperties) => {
  const { q } = await searchParams;

  if (!q) {
    redirect("/");
  }

  // Auth is enforced by the (authenticated) layout — no need to re-check here
  const pages = DEMO_PAGES.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <>
      <Header page="Search" pages={["Building Your Application"]} />
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

export default SearchPage;
