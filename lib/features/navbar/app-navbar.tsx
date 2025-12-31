import AuthButton from "@/lib/components/auth/components/auth-button";
import NavigationMenuDemo from "./nav-menu";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import NotificationsMenu from "../notifications/components/notifications-menu";
import ProfileMenu from "@/lib/features/user/components/profile-menu";
import { use } from "react";
import SearchBar from "../search/components/searchbar";
export async function AppNavbar({
  isAuthenticated,
  userId,
}: {
  isAuthenticated: boolean;
  userId: string;
}) {
  return (
    <section className="max-w-6xl mx-auto flex w-full items-baseline justify-between p-4">
      <div className="flex items-baseline gap-8">
        <div>
          <p className="text-2xl font-bold">Tonality</p>
        </div>
        {isAuthenticated && <NavigationMenuDemo />}
      </div>
      {!isAuthenticated && (
        <div className="ml-auto">
          <AuthButton mode="sign-in" />
        </div>
      )}
      <SearchBar />
      {/* User Actions */}
      <div className="flex items-baseline gap-6">
        {isAuthenticated && <NotificationsMenu userId={userId} />}
        {isAuthenticated && <ProfileMenu userId={userId} />}
      </div>
    </section>
  );
}
