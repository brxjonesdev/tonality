import React from "react";
import { Button } from "@/lib/components/shared/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/lib/components/shared/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/lib/components/shared/empty";
import {
  ArrowLeftSquareIcon,
  BadgeHelpIcon,
  ListMinusIcon,
  ListMusic,
  LucideDisc3,
  MailQuestionMark,
} from "lucide-react";
import { no } from "zod/v4/locales";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/lib/components/shared/avatar";
import {
  UserIcon,
  SettingsIcon,
  CreditCardIcon,
  BellIcon,
  LogOutIcon,
} from "lucide-react";
import { Dropdown } from "react-day-picker";
import AuthButton from "@/lib/components/auth/components/auth-button";

const listItems = [
  {
    icon: UserIcon,
    property: "Profile",
  },
  {
    icon: ListMusic,
    property: "Your Reviews",
  },
  {
    icon: ListMusic,
    property: "Your Crates",
  },
  {
    icon: SettingsIcon,
    property: "Settings",
  },
  {
    icon: BadgeHelpIcon,
    property: "Help & Support",
  },
];

export default function ProfileMenu({ userId }: { userId: string }) {
  const userID = "@irenereveluv";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"default"}
          className="relative hover:bg-blue-200 h-fit text-md"
        >
          {userID}
          <Avatar className="ml-2 w-10 h-10">
            <AvatarFallback>{userID.charAt(1).toUpperCase()}</AvatarFallback>
            <AvatarImage src="https://pbs.twimg.com/media/DjZaJ1YU4AA11MC.jpg">
              {/* User's profile image URL can be placed here */}
            </AvatarImage>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" sideOffset={15}>
        <DropdownMenuLabel className="text-center">Profile</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {listItems.map((item, index) => (
            <DropdownMenuItem key={index}>
              <item.icon />
              <span className="text-popover-foreground">{item.property}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <AuthButton mode="sign-out" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
