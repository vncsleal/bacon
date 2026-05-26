import { Button } from "@repo/design-system/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@repo/design-system/components/ui/empty";
import Link from "next/link";

const NotFound = () => (
  <div className="flex min-h-screen items-center justify-center p-6">
    <Empty>
      <EmptyHeader>
        <EmptyTitle>Page not found</EmptyTitle>
        <EmptyDescription>
          The page you are looking for does not exist or has been moved.
        </EmptyDescription>
      </EmptyHeader>
      <Button asChild>
        <Link href="/">Go home</Link>
      </Button>
    </Empty>
  </div>
);

export default NotFound;
