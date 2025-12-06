import React from "react";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SearchBar from "@/lib/features/music-cache/search/components/searchbar";

export default async function Homepage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || !session.user) {
    redirect("/signin");
  }
  return (
    <section className="max-w-6xl mx-auto p-4">
      <SearchBar />
    </section>
  );
}

//
