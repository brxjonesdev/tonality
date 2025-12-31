"use client";

import * as React from "react";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/lib/components/shared/navigation-menu";

import { cn } from "@/lib/utils";

// music-nav.links.ts
export const musicNavLinks = [
  {
    title: "Explore Music",
    href: "/explore",
    description:
      "Discover new tunes, albums, and artists tailored to your taste.",
  },
  {
    title: "Top Charts",
    href: "/charts",
    description:
      "Stay updated with the latest hits and trending tracks worldwide.",
  },
  {
    title: "Genres & Moods",
    href: "/genres",
    description:
      "Dive into music based on your current mood or favorite genre.",
  },
  {
    title: "New Releases",
    href: "/new-releases",
    description: "Be the first to listen to the freshest tracks and albums.",
  },
] as const;

export default function NavMenu() {
  return (
    <NavigationMenu className="z-5 p-0">
      <NavigationMenuList className="">
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            <Link href={"/home"}>Home</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="sm:block hidden">
          <NavigationMenuTrigger>Music</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {musicNavLinks.map((link) => (
                <ListItem key={link.href} title={link.title} href={link.href}>
                  {link.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            <Link href="/reviews">Reviews</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            <Link href={"/crates"}>Crates</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  className,
  title,
  children,
  ...props
}: React.ComponentProps<"a">) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          className={cn(
            "hover:bg-accent block text-main-foreground select-none space-y-1 rounded-base border-2 border-transparent p-3 leading-none no-underline outline-hidden transition-colors hover:border-border",
            className,
          )}
          {...props}
        >
          <div className="text-base font-heading leading-none">{title}</div>
          <p className="font-base line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
}
ListItem.displayName = "ListItem";
