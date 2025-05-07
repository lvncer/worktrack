export type UserRole = "メンバー" | "主任" | "責任者";
export type SystemPrivilege = "一般ユーザー" | "システム管理者";

export interface User {
  id: number;
  department_flag: number;
  department_id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  password: string; // Hashed in a real app
  role: UserRole;
  system_privilege: SystemPrivilege;
  remember_token: string | null;
  created_at: string;
  updated_at: string;
}

export const users: User[] = [
  {
    id: 1,
    department_flag: 100,
    department_id: 1,
    name: "佐藤 太郎",
    email: "sato@example.com",
    email_verified_at: "2023-01-01T00:00:00Z",
    password: "password123", // In a real app, this would be hashed
    role: "責任者",
    system_privilege: "システム管理者",
    remember_token: null,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: 2,
    department_flag: 200,
    department_id: 2,
    name: "鈴木 花子",
    email: "suzuki@example.com",
    email_verified_at: "2023-01-01T00:00:00Z",
    password: "password123",
    role: "主任",
    system_privilege: "一般ユーザー",
    remember_token: null,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: 3,
    department_flag: 200,
    department_id: 2,
    name: "田中 健太",
    email: "tanaka@example.com",
    email_verified_at: "2023-01-01T00:00:00Z",
    password: "password123",
    role: "メンバー",
    system_privilege: "一般ユーザー",
    remember_token: null,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: 4,
    department_flag: 300,
    department_id: 3,
    name: "伊藤 美咲",
    email: "ito@example.com",
    email_verified_at: "2023-01-01T00:00:00Z",
    password: "password123",
    role: "責任者",
    system_privilege: "一般ユーザー",
    remember_token: null,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: 5,
    department_flag: 300,
    department_id: 3,
    name: "山田 雄太",
    email: "yamada@example.com",
    email_verified_at: "2023-01-01T00:00:00Z",
    password: "password123",
    role: "メンバー",
    system_privilege: "一般ユーザー",
    remember_token: null,
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
];

export const getUserById = (id: number): User | undefined => {
  return users.find((user) => user.id === id);
};

export const getUsersByDepartmentId = (departmentId: number): User[] => {
  return users.filter((user) => user.department_id === departmentId);
};

export const getUserByEmail = (email: string): User | undefined => {
  return users.find((user) => user.email === email);
};

export function getUserWithDepartment(userId: number) {
  const user = getUserById(userId);
  if (!user) return null;

  const department = getDepartmentById(user.department_id);
  return {
    ...user,
    department: department || null,
  };
}
