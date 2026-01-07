import HeroLanding from "@/lib/components/views/hero-landing";
import { createClient } from "@/lib/supabase/server";
import CratesTimeline from "@/lib/features/crates/components/crates-timeline";
import UserMenu from "@/lib/features/user/user-menu";
import ReviewTimeline from "@/lib/features/review/components/review-timeline";
import PopularItems from "@/lib/features/review/components/popular-items";

export default async function TonalityHome() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="p-4 flex flex-col max-w-5xl mx-auto w-full flex-1">
        {user ? null : <HeroLanding />}
        <section className="grid grid-cols-1 md:grid-cols-2">
          <div>
            {user ? <UserMenu userId={user?.id} /> : null}
            <PopularItems />
            <ReviewTimeline userId={user?.id || ""} />
          </div>
          {user ? <CratesTimeline userId={user?.id || ""} /> : null}
        </section>
      </main>
    </div>
  );
}
