import { Skeleton } from "@repo/design-system/components/ui/skeleton";

const Loading = () => (
  <div className="flex flex-1 flex-col gap-6 p-6">
    <div className="flex items-center gap-3">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-9 w-24" />
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Skeleton className="h-32 rounded-lg" />
      <Skeleton className="h-32 rounded-lg" />
      <Skeleton className="h-32 rounded-lg" />
    </div>
    <Skeleton className="h-64 rounded-lg" />
  </div>
);

export default Loading;
