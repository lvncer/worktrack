'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { PageHeader } from '@/components/layout/page-header';
import { WorkForm } from '@/components/work/work-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { getWorkLogById } from '@/lib/data/work-logs';

export default function EditWorkPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [workLog, setWorkLog] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    const workLogId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
    if (isNaN(workLogId)) {
      setError('無効な作業IDです');
      setLoading(false);
      return;
    }

    const workLog = getWorkLogById(workLogId);
    if (!workLog) {
      setError('作業記録が見つかりません');
      setLoading(false);
      return;
    }

    // 権限チェック
    const canEdit = 
      workLog.user_id === user.id || 
      user.role === '責任者' || 
      user.role === '主任';

    if (!canEdit) {
      setError('この作業記録を編集する権限がありません');
      setLoading(false);
      return;
    }

    setWorkLog(workLog);
    setLoading(false);
  }, [id, user, router]);

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

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <PageHeader path="/work/edit" title="作業編集" />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <PageHeader path="/work/edit" title="作業編集" description="既存の作業内容を編集します" />
      
      <WorkForm 
        userId={user.id} 
        departmentId={user.department_id}
        departmentFlag={user.department_flag}
        workLogId={workLog.id}
        isEdit={true}
      />
    </div>
  );
}