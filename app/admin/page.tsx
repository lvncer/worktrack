"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { PageHeader } from "@/components/layout/page-header";
import { AdminMenu } from "@/components/admin/admin-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const { user, status } = useAuth();

  // システム管理者のみアクセス可能
  const isAdmin = user?.system_privilege === "システム管理者";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && !isAdmin) {
      router.push("/work");
    }
  }, [router, status, isAdmin]);

  if (status === "loading") {
    return (
      <div className="container max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container max-w-screen-xl mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>アクセス制限</AlertTitle>
          <AlertDescription>
            このページにアクセスする権限がありません。
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-8">
      <PageHeader
        path="/admin"
        description="各種マスタデータの管理、システム設定を行います"
      />

      <AdminMenu />
    </div>
  );
}
