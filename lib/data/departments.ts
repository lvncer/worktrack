export interface Department {
  id: number;
  department_flag: number;
  name: string;
  remarks: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export const departments: Department[] = [
  {
    id: 1,
    department_flag: 100,
    name: "営業部",
    remarks: "営業関連の業務を担当",
    status: "active",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: 2,
    department_flag: 200,
    name: "開発部",
    remarks: "システム開発を担当",
    status: "active",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: 3,
    department_flag: 300,
    name: "カスタマーサポート部",
    remarks: "顧客対応を担当",
    status: "active",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: 4,
    department_flag: 400,
    name: "人事部",
    remarks: "人事関連の業務を担当",
    status: "active",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: 5,
    department_flag: 500,
    name: "総務部",
    remarks: "総務関連の業務を担当",
    status: "inactive",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-06-15T00:00:00Z",
  },
];

export const getDepartmentById = (id: number): Department | undefined => {
  return departments.find((department) => department.id === id);
};

export const getActiveDepartments = (): Department[] => {
  return departments.filter((department) => department.status === "active");
};
