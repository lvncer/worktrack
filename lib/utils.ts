import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function formatDateTime(dateTimeString: string): string {
  const date = new Date(dateTimeString);
  return date.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(":");
  return `${hours}:${minutes}`;
}

export function calculateDuration(
  startTime: string,
  endTime: string | null
): string {
  if (!endTime) return "-";

  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;

  let diffMinutes = endTotalMinutes - startTotalMinutes;
  if (diffMinutes < 0) {
    diffMinutes += 24 * 60; // 日をまたいだ場合
  }

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  return `${hours}時間${minutes > 0 ? `${minutes}分` : ""}`;
}

export function getPageTitle(path: string): string {
  const pathSegments = path.split("/").filter(Boolean);

  if (pathSegments.length === 0) return "ホーム";

  const pageTitles: Record<string, string> = {
    login: "ログイン",
    "password-reset": "パスワード再設定",
    work: "作業内容一覧",
    new: "作業登録",
    edit: "作業編集",
    aggregation: "工数集計",
    admin: "システム管理",
    users: "ユーザー管理",
    departments: "部署管理",
    customers: "顧客管理",
    projects: "案件管理",
    categories: "カテゴリ管理",
    reminders: "リマインダー設定",
    logs: "ログ閲覧",
  };

  return pageTitles[pathSegments[0]] || "ページが見つかりません";
}

export function downloadCSV(data: string, filename: string): void {
  const blob = new Blob(["\uFEFF" + data], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function jsonToCSV(json: any[]): string {
  if (!json || json.length === 0) return "";

  const header = Object.keys(json[0]).join(",");
  const rows = json.map((obj) =>
    Object.values(obj)
      .map((val) =>
        typeof val === "string" ? `"${val.replace(/"/g, '""')}"` : val
      )
      .join(",")
  );

  return [header, ...rows].join("\n");
}
