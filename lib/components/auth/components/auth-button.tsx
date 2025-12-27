"use client";
import React from "react";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

const signOut = async () => {
  await supabase.auth.signOut();
  // Optionally, you can refresh the page or redirect the user after sign-out
  window.location.reload();
};

const signIn = async () => {
  const callbackUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback?next=${encodeURIComponent("/home")}`;

  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl,
    },
  });
};

export default function AuthButton({ mode }: { mode: "sign-in" | "sign-out" }) {
  return (
    <button
      onClick={mode === "sign-in" ? signIn : signOut}
      className="bg-blue-600"
    >
      {mode === "sign-in" ? "Sign In" : "Sign Out"}
    </button>
  );
}
