import React from "react";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SearchBar from "@/lib/features/search/components/searchbar";
import AppMenu from "./_components/menu";
import ReviewTimeline from "@/lib/features/review/components/review-timeline";
import PopularAndNew from "./_components/popular";
import CratesTimeline from "@/lib/features/crates/components/crates-timeline";

export default async function Homepage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    redirect("/");
  }
  return (
    <section className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-[2fr_1fr] flex-1 gap-4">
      {/* Left (main) section */}
      <div className="flex flex-col gap-4 flex-1">
        <AppMenu />
        <ReviewTimeline userId={data.user.id} />
      </div>

      {/* Right (sidebar) section */}
      <div className="flex flex-col gap-4">
        <PopularAndNew />
        <CratesTimeline userId={data.user.id} />
      </div>
    </section>
  );
}

//
