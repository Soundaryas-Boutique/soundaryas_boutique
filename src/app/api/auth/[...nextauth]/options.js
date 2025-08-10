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
        await connectDB(); // ensure connection

        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("Invalid email or password");
        }

        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) {
          throw new Error("Invalid email or password");
        }

        return { id: user._id, email: user.email, name: user.name };
      }
    })
  ],
  pages: {
    signIn: "/signin"
  }
};
