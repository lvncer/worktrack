'use client';

import Link from 'next/link';
import { 
  Users, 
  Building2, 
  Store, 
  FolderKanban, 
  Tags, 
  ClipboardCheck,
  Bell, 
  FileText 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminMenuItem {
  href: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

const adminMenuItems: AdminMenuItem[] = [
  {
    href: '/admin/users',
    label: 'ユーザー管理',
    icon: Users,
    description: 'ユーザーアカウントの作成・編集・停止',
  },
  {
    href: '/admin/departments',
    label: '部署管理',
    icon: Building2,
    description: '部署の追加・編集・無効化',
  },
  {
    href: '/admin/customers',
    label: '顧客管理',
    icon: Store,
    description: '顧客情報の追加・編集・無効化',
  },
  {
    href: '/admin/projects',
    label: '案件管理',
    icon: FolderKanban,
    description: '案件の追加・編集・無効化',
  },
  {
    href: '/admin/categories',
    label: 'カテゴリ管理',
    icon: Tags,
    description: '作業カテゴリの追加・編集・無効化',
  },
  {
    href: '/admin/reminders',
    label: 'リマインダー設定',
    icon: Bell,
    description: '未入力リマインダーの設定・編集',
  },
  {
    href: '/admin/logs',
    label: 'ログ閲覧',
    icon: FileText,
    description: 'ユーザーの操作ログを閲覧',
  },
];

export function AdminMenu() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {adminMenuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "group flex flex-col items-center p-6 bg-card rounded-lg border border-border",
            "hover:border-primary/50 hover:shadow-md transition-all duration-300"
          )}
        >
          <div className="h-12 w-12 rounded-full flex items-center justify-center bg-primary/10 text-primary mb-4">
            <item.icon className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
            {item.label}
          </h3>
          <p className="text-muted-foreground text-center text-sm">
            {item.description}
          </p>
        </Link>
      ))}
    </div>
  );
}