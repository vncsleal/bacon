import { redirect } from "next/navigation";

// Clerk catch-all route replaced by better-auth sign-up at (better-auth)/sign-up
const SignUpRedirect = () => redirect("/sign-up");

export default SignUpRedirect;
