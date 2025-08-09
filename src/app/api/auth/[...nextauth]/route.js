import NextAuth from "next-auth";
import {options} from "./options";

const handler = NextAuth(options);
export {handler as GET, handler as POST};
// This code sets up NextAuth.js for authentication in a Next.js application.

