export interface WorkSubCategory {
  id: number;
  department_flag: number;
  sub_category_id_str: string;
  name: string;
  remarks: string | null;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export const workSubCategories: WorkSubCategory[] = [
  {
    id: 1,
    department_flag: 100,
    sub_category_id_str: 'SUB001',
    name: '提案',
    remarks: '顧客への提案活動',
    status: 'active',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 2,
    department_flag: 100,
    sub_category_id_str: 'SUB002',
    name: '契約締結',
    remarks: '契約に関する作業',
    status: 'active',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 3,
    department_flag: 200,
    sub_category_id_str: 'SUB003',
    name: '要件定義',
    remarks: '要件の定義作業',
    status: 'active',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 4,
    department_flag: 200,
    sub_category_id_str: 'SUB004',
    name: 'コーディング',
    remarks: 'プログラミング作業',
    status: 'active',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 5,
    department_flag: 200,
    sub_category_id_str: 'SUB005',
    name: 'テスト',
    remarks: 'テスト作業',
    status: 'active',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 6,
    department_flag: 300,
    sub_category_id_str: 'SUB006',
    name: '問い合わせ対応',
    remarks: '顧客からの問い合わせへの対応',
    status: 'active',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 7,
    department_flag: 300,
    sub_category_id_str: 'SUB007',
    name: '障害対応',
    remarks: 'システム障害への対応',
    status: 'inactive',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-06-15T00:00:00Z',
  },
];

export const getWorkSubCategoryById = (id: number): WorkSubCategory | undefined => {
  return workSubCategories.find(subCategory => subCategory.id === id);
};

export const getActiveWorkSubCategories = (): WorkSubCategory[] => {
  return workSubCategories.filter(subCategory => subCategory.status === 'active');
};

export const getWorkSubCategoriesByDepartmentFlag = (departmentFlag: number): WorkSubCategory[] => {
  return workSubCategories.filter(
    subCategory => subCategory.department_flag === departmentFlag && subCategory.status === 'active'
  );
};