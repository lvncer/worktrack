"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function Home() {
  const router = useRouter();
  const { status } = useAuth();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      router.push("/work");
    }
  }, [router, status]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse text-lg">リダイレクト中...</div>
    </div>
  );
}
