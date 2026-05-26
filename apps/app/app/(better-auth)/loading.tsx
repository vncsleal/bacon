import { Spinner } from "@repo/design-system/components/ui/spinner";

const Loading = () => (
  <div className="flex w-full max-w-[400px] items-center justify-center py-12">
    <Spinner className="size-6 text-muted-foreground" />
  </div>
);

export default Loading;
