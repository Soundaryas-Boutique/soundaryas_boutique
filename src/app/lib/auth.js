import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Users from "@/app/(models)/User"; // Your User model
import { connectDB } from "./mongoose2";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await Users.findOne({ email: credentials.email });
        if (user && user.password === credentials.password) {
          return { id: user._id, email: user.email, role: user.role };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (token) session.user.role = token.role;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
