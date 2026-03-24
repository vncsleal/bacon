import { redirect } from "next/navigation";

// Clerk catch-all route replaced by better-auth sign-in at (better-auth)/sign-in
const SignInRedirect = () => redirect("/sign-in");

export default SignInRedirect;
