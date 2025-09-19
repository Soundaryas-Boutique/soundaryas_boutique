import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/app/lib/mongoose";
import User from "@/app/(models)/User";
import bcrypt from "bcrypt";

export const options = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("Invalid email or password");
        }

        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) {
          throw new Error("Invalid email or password");
        }

        // ✅ include role in returned object
        return { id: user._id, email: user.email, name: user.name, role: user.role };
      }
    })
  ],

  pages: {
    signIn: "/signin"
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // add role to JWT
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role; // add role to session
      }
      return session;
    }
  }
};
