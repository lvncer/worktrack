"use client";

import { useAuth } from "@/lib/auth";
import { PageHeader } from "@/components/layout/page-header";
import { WorkForm } from "@/components/work/work-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function NewWorkPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>
            ログインしていないか、セッションが切れています。ログインしてください。
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <PageHeader path="/work/new" description="新しい作業内容を登録します" />

      <WorkForm
        userId={user.id}
        departmentId={user.department_id}
        departmentFlag={user.department_flag}
      />
    </div>
  );
}
