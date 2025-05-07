import { getCustomerById } from "./customers";
import { getDepartmentById } from "./departments";
import { getProjectById } from "./projects";
import { getUserById } from "./users";
import { getWorkCategoryById } from "./work-categories";
import { getWorkSubCategoryById } from "./work-sub-categories";

export type WorkStatus = "完了" | "継続";

export interface WorkLog {
  id: number;
  user_id: number;
  department_id: number;
  customer_id: number;
  work_date: string; // 'YYYY-MM-DD'
  start_time: string; // 'HH:MM:SS'
  end_time: string | null; // 'HH:MM:SS'
  work_category_id: number | null;
  work_sub_category_id: number | null;
  project_id: number | null;
  project_name_input: string | null;
  customer_contact: string | null;
  work_details: string | null;
  work_status: WorkStatus;
  memo: string | null;
  created_at: string;
  updated_at: string;
}

export const workLogs: WorkLog[] = [
  {
    id: 1,
    user_id: 1,
    department_id: 1,
    customer_id: 1,
    work_date: "2023-04-01",
    start_time: "09:00:00",
    end_time: "12:00:00",
    work_category_id: 1,
    work_sub_category_id: 1,
    project_id: 4,
    project_name_input: null,
    customer_contact: "山田部長",
    work_details: "新規システム導入の提案",
    work_status: "完了",
    memo: "次回は見積もりを持参する",
    created_at: "2023-04-01T12:30:00Z",
    updated_at: "2023-04-01T12:30:00Z",
  },
  {
    id: 2,
    user_id: 2,
    department_id: 2,
    customer_id: 3,
    work_date: "2023-04-01",
    start_time: "13:00:00",
    end_time: "17:30:00",
    work_category_id: 3,
    work_sub_category_id: 3,
    project_id: 1,
    project_name_input: null,
    customer_contact: "佐藤課長",
    work_details: "要件定義ドキュメントの作成",
    work_status: "継続",
    memo: "明日も続きを行う",
    created_at: "2023-04-01T18:00:00Z",
    updated_at: "2023-04-01T18:00:00Z",
  },
  {
    id: 3,
    user_id: 3,
    department_id: 2,
    customer_id: 2,
    work_date: "2023-04-02",
    start_time: "09:30:00",
    end_time: "17:00:00",
    work_category_id: 4,
    work_sub_category_id: 4,
    project_id: 2,
    project_name_input: null,
    customer_contact: null,
    work_details: "バグ修正対応",
    work_status: "完了",
    memo: null,
    created_at: "2023-04-02T17:30:00Z",
    updated_at: "2023-04-02T17:30:00Z",
  },
  {
    id: 4,
    user_id: 4,
    department_id: 3,
    customer_id: 4,
    work_date: "2023-04-03",
    start_time: "10:00:00",
    end_time: "15:00:00",
    work_category_id: 5,
    work_sub_category_id: 6,
    project_id: 3,
    project_name_input: null,
    customer_contact: "高橋部長",
    work_details: "システム利用に関する問い合わせ対応",
    work_status: "完了",
    memo: "マニュアルの更新が必要",
    created_at: "2023-04-03T15:30:00Z",
    updated_at: "2023-04-03T15:30:00Z",
  },
  {
    id: 5,
    user_id: 5,
    department_id: 3,
    customer_id: 1,
    work_date: "2023-04-03",
    start_time: "09:00:00",
    end_time: null,
    work_category_id: 5,
    work_sub_category_id: 6,
    project_id: null,
    project_name_input: "ヘルプデスク対応",
    customer_contact: "田中様",
    work_details: "ログインできない問題の調査",
    work_status: "継続",
    memo: "翌日も継続して対応予定",
    created_at: "2023-04-03T17:00:00Z",
    updated_at: "2023-04-03T17:00:00Z",
  },
];

export const getWorkLogById = (id: number): WorkLog | undefined => {
  return workLogs.find((log) => log.id === id);
};

export const getWorkLogsByUserId = (userId: number): WorkLog[] => {
  return workLogs.filter((log) => log.user_id === userId);
};

export const getWorkLogsByDepartmentId = (departmentId: number): WorkLog[] => {
  return workLogs.filter((log) => log.department_id === departmentId);
};

export const getWorkLogsByDate = (date: string): WorkLog[] => {
  return workLogs.filter((log) => log.work_date === date);
};

export function getWorkLogWithDetails(workLogId: number) {
  const workLog = getWorkLogById(workLogId);
  if (!workLog) return null;

  const user = getUserById(workLog.user_id);
  const department = getDepartmentById(workLog.department_id);
  const customer = getCustomerById(workLog.customer_id);
  const workCategory = workLog.work_category_id
    ? getWorkCategoryById(workLog.work_category_id)
    : null;
  const workSubCategory = workLog.work_sub_category_id
    ? getWorkSubCategoryById(workLog.work_sub_category_id)
    : null;
  const project = workLog.project_id
    ? getProjectById(workLog.project_id)
    : null;

  return {
    ...workLog,
    user: user || null,
    department: department || null,
    customer: customer || null,
    workCategory: workCategory,
    workSubCategory: workSubCategory,
    project: project,
  };
}

export function calculateWorkHours(workLog: WorkLog): number | null {
  if (!workLog.end_time) return null;

  const startParts = workLog.start_time.split(":").map(Number);
  const endParts = workLog.end_time.split(":").map(Number);

  const startMinutes = startParts[0] * 60 + startParts[1];
  const endMinutes = endParts[0] * 60 + endParts[1];

  const diffMinutes = endMinutes - startMinutes;

  return diffMinutes / 60;
}

export function addWorkLog(
  workLog: Omit<WorkLog, "id" | "created_at" | "updated_at">
): WorkLog {
  const now = new Date().toISOString();
  const newId = Math.max(...workLogs.map((log) => log.id)) + 1;

  const newWorkLog: WorkLog = {
    ...workLog,
    id: newId,
    created_at: now,
    updated_at: now,
  };

  workLogs.push(newWorkLog);
  return newWorkLog;
}

export function updateWorkLog(
  id: number,
  workLog: Partial<WorkLog>
): WorkLog | null {
  const index = workLogs.findIndex((log) => log.id === id);
  if (index === -1) return null;

  const now = new Date().toISOString();

  workLogs[index] = {
    ...workLogs[index],
    ...workLog,
    updated_at: now,
  };

  return workLogs[index];
}

export function deleteWorkLog(id: number): boolean {
  const index = workLogs.findIndex((log) => log.id === id);
  if (index === -1) return false;

  workLogs.splice(index, 1);
  return true;
}

export function filterWorkLogs(filters: {
  startDate?: string;
  endDate?: string;
  departmentId?: number;
  userId?: number;
  customerId?: number;
  projectId?: number;
  workCategoryId?: number;
  workStatus?: WorkStatus;
}): WorkLog[] {
  return workLogs.filter((log) => {
    if (filters.startDate && log.work_date < filters.startDate) return false;
    if (filters.endDate && log.work_date > filters.endDate) return false;
    if (
      filters.departmentId !== undefined &&
      log.department_id !== filters.departmentId
    )
      return false;
    if (filters.userId !== undefined && log.user_id !== filters.userId)
      return false;
    if (
      filters.customerId !== undefined &&
      log.customer_id !== filters.customerId
    )
      return false;
    if (filters.projectId !== undefined && log.project_id !== filters.projectId)
      return false;
    if (
      filters.workCategoryId !== undefined &&
      log.work_category_id !== filters.workCategoryId
    )
      return false;
    if (
      filters.workStatus !== undefined &&
      log.work_status !== filters.workStatus
    )
      return false;

    return true;
  });
}
