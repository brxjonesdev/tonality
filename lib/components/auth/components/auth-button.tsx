"use client";
import React from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "../../shared/button";
import { Disc3, DiscAlbumIcon } from "lucide-react";
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
    <Button
      variant={`noShadow`}
      onClick={mode === "sign-in" ? signIn : signOut}
      className="w-full"
    >
      <Disc3 className="h-4 w-4" />
      {mode === "sign-in" ? "Sign In" : "Sign Out"}
    </Button>
  );
}
