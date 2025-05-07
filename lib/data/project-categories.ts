export interface ProjectCategory {
  id: number;
  category_name: string;
  remarks: string | null;
  created_at: string;
  updated_at: string;
}

export const projectCategories: ProjectCategory[] = [
  {
    id: 1,
    category_name: '開発プロジェクト',
    remarks: '新規システム開発',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 2,
    category_name: '保守プロジェクト',
    remarks: '既存システムの保守',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 3,
    category_name: 'コンサルティング',
    remarks: 'システムコンサルティング',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 4,
    category_name: '研修',
    remarks: 'トレーニング・研修',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 5,
    category_name: '営業活動',
    remarks: '新規顧客開拓、既存顧客対応',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  },
];

export const getProjectCategoryById = (id: number): ProjectCategory | undefined => {
  return projectCategories.find(category => category.id === id);
};