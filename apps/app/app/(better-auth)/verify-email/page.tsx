import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";

const title = "Verify your email";
const description = "Check your inbox for the verification link.";

export const metadata: Metadata = createMetadata({ title, description });

const VerifyEmailPage = () => (
  <div className="flex flex-col space-y-2 text-center">
    <h1 className="font-semibold text-2xl tracking-tight">{title}</h1>
    <p className="text-muted-foreground text-sm">{description}</p>
  </div>
);

export default VerifyEmailPage;
