import { cratesService } from "@/lib/features/crates/index";
import React from "react";

export default async function CratesHome() {
  const userID = "braxtonid";
  const [popularCrates, newCrates, userCrates] = await Promise.all([
    cratesService.getPopularCrates(),
    cratesService.getNewCrates(),
    cratesService.getUserCrates(userID),
  ]);
  return (
    <div className="flex gap-4 flex-col">
      <p>Popular Crates: {JSON.stringify(popularCrates)}</p>
      <p>New Crates: {JSON.stringify(newCrates)}</p>
      <p>User Crates: {JSON.stringify(userCrates)}</p>
    </div>
  );
}
