export interface WorkCategory {
  id: number;
  department_flag: number;
  category_id_str: string;
  name: string;
  remarks: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export const workCategories: WorkCategory[] = [
  {
    id: 1,
    department_flag: 100,
    category_id_str: "CAT001",
    name: "顧客訪問",
    remarks: "顧客先での打ち合わせ",
    status: "active",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: 2,
    department_flag: 100,
    category_id_str: "CAT002",
    name: "社内会議",
    remarks: "社内での会議や打ち合わせ",
    status: "active",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: 3,
    department_flag: 200,
    category_id_str: "CAT003",
    name: "設計作業",
    remarks: "システム設計に関わる作業",
    status: "active",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: 4,
    department_flag: 200,
    category_id_str: "CAT004",
    name: "開発作業",
    remarks: "プログラミングやテストなどの開発作業",
    status: "active",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: 5,
    department_flag: 300,
    category_id_str: "CAT005",
    name: "顧客サポート",
    remarks: "顧客からの問い合わせ対応など",
    status: "active",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: 6,
    department_flag: 400,
    category_id_str: "CAT006",
    name: "採用活動",
    remarks: "採用面接や選考作業",
    status: "inactive",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-06-15T00:00:00Z",
  },
];

export const getWorkCategoryById = (id: number): WorkCategory | undefined => {
  return workCategories.find((category) => category.id === id);
};

export const getActiveWorkCategories = (): WorkCategory[] => {
  return workCategories.filter((category) => category.status === "active");
};

export const getWorkCategoriesByDepartmentFlag = (
  departmentFlag: number
): WorkCategory[] => {
  return workCategories.filter(
    (category) =>
      category.department_flag === departmentFlag &&
      category.status === "active"
  );
};
