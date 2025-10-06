import  NextAuth  from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_CLIENT_ID!,
      clientSecret: process.env.AUTH_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.AUTH_SECRET,
});

export { handler as GET, handler as POST };
