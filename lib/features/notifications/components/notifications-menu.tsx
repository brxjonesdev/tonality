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
  Disc2Icon,
  LucideDisc3,
  MailQuestionMark,
  Music2Icon,
} from "lucide-react";
import { no } from "zod/v4/locales";
export default function NotificationsMenu({ userId }: { userId: string }) {
  const notifications = Array.from({ length: 9002 }, (_, i) => ({
    id: i + 1,
    message: `This is notification ${i + 1}`,
  }));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"noShadow"}
          size={"icon"}
          className="relative hover:bg-blue-200 h-12 w-12 p-0"
        >
          <Music2Icon className="w-6 h-6 text-primary" />
          {/*Notification Count */}
          <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center min-w-5 h-5 px-2 text-xs font-bold leading-none text-white bg-cyan-700 rounded-full">
            {notifications.length}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" sideOffset={15}>
        <Empty className="md:p-4">
          <EmptyHeader className="p-0">
            <EmptyTitle className="font-extrabold">
              Notification Feature Coming Soon!
            </EmptyTitle>
            <EmptyDescription>
              We're working hard to bring you real-time notifications so you can
              stay updated with the latest from Tonality. Stay tuned!
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
