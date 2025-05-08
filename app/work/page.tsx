"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  deleteWorkLog,
  filterWorkLogs,
  getWorkLogWithDetails,
  calculateWorkHours,
} from "@/lib/data/work-logs";
import { getActiveCustomers } from "@/lib/data/customers";
import { getActiveProjects } from "@/lib/data/projects";
import { getActiveDepartments } from "@/lib/data/departments";
import { getUsersByDepartmentId } from "@/lib/data/users";
import { Plus, Pencil, Trash2, FileEdit, Filter } from "lucide-react";
import { formatDate, formatTime, calculateDuration } from "@/lib/utils";

export default function WorkListPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteWorkLogId, setDeleteWorkLogId] = useState<number | null>(null);

  const [filters, setFilters] = useState({
    startDate: new Date().toISOString().slice(0, 10),
    endDate: "",
    departmentId: 0,
    userId: 0,
    customerId: 0,
    projectId: 0,
  });

  const departments = getActiveDepartments();
  const customers = getActiveCustomers();
  const projects = getActiveProjects();
  const [users, setUsers] = useState<any[]>([]);

  const [workLogs, setWorkLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 権限チェック
  const canEditOthers = user?.role === "責任者" || user?.role === "主任";
  const isAdmin = user?.system_privilege === "システム管理者";

  useEffect(() => {
    if (!user) return;

    // 部署が選択されている場合、その部署のユーザーを取得
    if (filters.departmentId) {
      setUsers(getUsersByDepartmentId(filters.departmentId));
    } else {
      // 部署が選択されていない場合、自部署のユーザーを取得
      setUsers(getUsersByDepartmentId(user.department_id));
    }

    // 初期フィルターを設定
    setFilters((prev) => ({
      ...prev,
      departmentId: prev.departmentId || user.department_id,
    }));

    applyFilters();
  }, [user]);

  // フィルター適用
  const applyFilters = () => {
    setLoading(true);

    try {
      const appliedFilters: any = {};

      if (filters.startDate) appliedFilters.startDate = filters.startDate;
      if (filters.endDate) appliedFilters.endDate = filters.endDate;
      if (filters.departmentId)
        appliedFilters.departmentId = filters.departmentId;
      if (filters.userId) appliedFilters.userId = filters.userId;
      if (filters.customerId) appliedFilters.customerId = filters.customerId;
      if (filters.projectId) appliedFilters.projectId = filters.projectId;

      const filteredLogs = filterWorkLogs(appliedFilters);

      // 各ログの詳細情報を取得
      const logsWithDetails = filteredLogs.map((log) =>
        getWorkLogWithDetails(log.id)
      );

      setWorkLogs(logsWithDetails.filter(Boolean));
    } catch (error) {
      console.error("Error applying filters:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = () => {
    applyFilters();
    setShowFilterDialog(false);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteWorkLogId(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteWorkLogId) {
      deleteWorkLog(deleteWorkLogId);
      applyFilters();
    }
    setShowDeleteDialog(false);
  };

  const canEditWorkLog = (workLog: any) => {
    if (!user || !workLog) return false;

    // 自分の作業記録は編集可能
    if (workLog.user_id === user.id) return true;

    // 責任者や主任は他のメンバーの作業も編集可能
    if (canEditOthers) return true;

    return false;
  };

  // 未入力アラート（例：過去30日間で終了時間が入力されていない作業）
  const incompleteEntries = useMemo(() => {
    if (!user) return [];

    return workLogs.filter(
      (log) =>
        log.user_id === user.id && (log.work_status === "継続" || !log.end_time)
    );
  }, [workLogs, user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-8">
      <PageHeader path="/work">
        <div className="flex space-x-2">
          <Button
            onClick={() => setShowFilterDialog(true)}
            variant="outline"
            size="sm"
          >
            <Filter className="h-4 w-4 mr-2" />
            フィルター
          </Button>
          <Button asChild>
            <Link href="/work/new">
              <Plus className="h-4 w-4 mr-2" />
              新規登録
            </Link>
          </Button>
        </div>
      </PageHeader>

      {incompleteEntries.length > 0 && (
        <Card className="mb-6 border-orange-300 bg-orange-50 dark:bg-orange-950/20">
          <CardHeader className="py-4">
            <CardTitle className="text-orange-700 dark:text-orange-400 text-base flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              未完了の作業があります
            </CardTitle>
          </CardHeader>
          <CardContent className="py-0 text-sm">
            <ul className="list-disc list-inside">
              {incompleteEntries.slice(0, 3).map((entry) => (
                <li key={entry.id} className="mb-1">
                  <span className="font-medium">
                    {formatDate(entry.work_date)}
                  </span>{" "}
                  -{entry.customer?.name} -{" "}
                  {entry.work_details?.substring(0, 30)}
                  {entry.work_details?.length > 30 ? "..." : ""}
                </li>
              ))}
              {incompleteEntries.length > 3 && (
                <li>他 {incompleteEntries.length - 3} 件...</li>
              )}
            </ul>
          </CardContent>
          <CardFooter className="py-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-orange-700 dark:text-orange-400"
            >
              すべて表示
            </Button>
          </CardFooter>
        </Card>
      )}

      <Card>
        <CardContent className="p-0 overflow-auto">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0">
              <TableRow>
                <TableHead className="w-[100px]">日付</TableHead>
                <TableHead className="w-[120px]">時間</TableHead>
                <TableHead className="w-[140px]">顧客</TableHead>
                <TableHead className="hidden md:table-cell">作業内容</TableHead>
                <TableHead className="hidden md:table-cell w-[120px]">
                  カテゴリ
                </TableHead>
                <TableHead className="hidden lg:table-cell w-[100px]">
                  担当者
                </TableHead>
                <TableHead className="w-[100px]">状態</TableHead>
                <TableHead className="w-[100px] text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-primary mr-2 align-middle"></div>
                    読み込み中...
                  </TableCell>
                </TableRow>
              ) : workLogs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    該当する作業記録がありません
                  </TableCell>
                </TableRow>
              ) : (
                workLogs.map((workLog) => (
                  <TableRow key={workLog.id} className="group">
                    <TableCell className="font-medium">
                      {formatDate(workLog.work_date)}
                    </TableCell>
                    <TableCell>
                      {formatTime(workLog.start_time)}
                      {workLog.end_time &&
                        ` 〜 ${formatTime(workLog.end_time)}`}
                      <div className="text-xs text-muted-foreground">
                        {workLog.end_time
                          ? calculateDuration(
                              workLog.start_time,
                              workLog.end_time
                            )
                          : "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className="truncate max-w-[140px]"
                        title={workLog.customer?.name}
                      >
                        {workLog.customer?.name}
                      </div>
                      {workLog.project && (
                        <div
                          className="text-xs text-muted-foreground truncate max-w-[140px]"
                          title={workLog.project?.name}
                        >
                          {workLog.project?.name}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div
                        className="truncate max-w-[300px]"
                        title={workLog.work_details}
                      >
                        {workLog.work_details}
                      </div>
                      {workLog.memo && (
                        <div
                          className="text-xs text-muted-foreground truncate max-w-[300px] mt-1"
                          title={workLog.memo}
                        >
                          メモ: {workLog.memo}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {workLog.workCategory?.name || "-"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {workLog.user?.name}
                    </TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          workLog.work_status === "完了"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                        }`}
                      >
                        {workLog.work_status}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {canEditWorkLog(workLog) && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => router.push(`/work/${workLog.id}`)}
                              className="h-8 w-8"
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">編集</span>
                            </Button>
                            {workLog.user_id === user.id && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteClick(workLog.id)}
                                className="h-8 w-8 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">削除</span>
                              </Button>
                            )}
                          </>
                        )}
                        {!canEditWorkLog(workLog) && canEditOthers && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              router.push(`/work/${workLog.id}/memo`)
                            }
                          >
                            <FileEdit className="h-4 w-4" />
                            <span className="sr-only">メモ追記</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* フィルターダイアログ */}
      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>検索条件</DialogTitle>
            <DialogDescription>
              表示する作業記録の条件を指定してください
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">開始日</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    handleFilterChange("startDate", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">終了日</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    handleFilterChange("endDate", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="departmentId">部署</Label>
              <Select
                value={filters.departmentId.toString()}
                onValueChange={(value) => {
                  handleFilterChange("departmentId", parseInt(value));
                  // 部署が変わったらユーザーリストを更新
                  if (parseInt(value)) {
                    setUsers(getUsersByDepartmentId(parseInt(value)));
                    handleFilterChange("userId", 0);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="部署を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">すべての部署</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="userId">担当者</Label>
              <Select
                value={filters.userId.toString()}
                onValueChange={(value) =>
                  handleFilterChange("userId", parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="担当者を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">すべての担当者</SelectItem>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id.toString()}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerId">顧客</Label>
              <Select
                value={filters.customerId.toString()}
                onValueChange={(value) =>
                  handleFilterChange("customerId", parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="顧客を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">すべての顧客</SelectItem>
                  {customers.map((customer) => (
                    <SelectItem
                      key={customer.id}
                      value={customer.id.toString()}
                    >
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectId">案件</Label>
              <Select
                value={filters.projectId.toString()}
                onValueChange={(value) =>
                  handleFilterChange("projectId", parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="案件を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">すべての案件</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowFilterDialog(false)}
            >
              キャンセル
            </Button>
            <Button onClick={handleFilterSubmit}>適用</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 削除確認ダイアログ */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>作業記録の削除</DialogTitle>
            <DialogDescription>
              この作業記録を削除しますか？この操作は元に戻せません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              キャンセル
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              削除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
