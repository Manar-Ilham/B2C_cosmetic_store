// src/app/page.js
"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div>
        <p>Welcome, {session?.user?.name}</p>
        <button onClick={() => signOut()}>Logout</button>
      </div>
    );
  }

  return (
    <div>
      <p>You are not logged in</p>
      <button onClick={() => signIn("google")}>Login with Google</button>
    </div>
  );
}
