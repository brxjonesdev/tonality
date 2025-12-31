import { Button } from "@/lib/components/shared/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/components/shared/card";
import { Badge } from "@/lib/components/shared/badge";
import {
  LucideStars,
  Music2,
  Disc3,
  Radio,
  Share2,
  Users,
  Heart,
  ArrowRight,
  Music4Icon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Hero } from "@/lib/features/landing/hero";
import AuthButton from "@/lib/components/auth/components/auth-button";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="p-4 flex flex-col max-w-5xl mx-auto w-full flex-1"></main>
    </div>
  );
}
