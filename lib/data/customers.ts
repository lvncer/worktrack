export interface Customer {
  id: number;
  department_flag: number;
  customer_id_str: string;
  name: string;
  short_name: string;
  affiliation: string;
  region: string;
  default_project_id: number | null;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export const customers: Customer[] = [
  {
    id: 1,
    department_flag: 100,
    customer_id_str: 'CUST001',
    name: '株式会社ABC',
    short_name: 'ABC',
    affiliation: '東京支店',
    region: '関東',
    default_project_id: 1,
    status: 'active',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 2,
    department_flag: 100,
    customer_id_str: 'CUST002',
    name: '株式会社XYZ',
    short_name: 'XYZ',
    affiliation: '大阪支店',
    region: '関西',
    default_project_id: 2,
    status: 'active',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 3,
    department_flag: 200,
    customer_id_str: 'CUST003',
    name: '株式会社テクノロジー',
    short_name: 'テクノ',
    affiliation: '福岡支店',
    region: '九州',
    default_project_id: 3,
    status: 'active',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 4,
    department_flag: 300,
    customer_id_str: 'CUST004',
    name: '株式会社インフォメーション',
    short_name: 'インフォ',
    affiliation: '名古屋支店',
    region: '中部',
    default_project_id: 4,
    status: 'active',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 5,
    department_flag: 300,
    customer_id_str: 'CUST005',
    name: '株式会社マーケティング',
    short_name: 'マーケ',
    affiliation: '札幌支店',
    region: '北海道',
    default_project_id: null,
    status: 'inactive',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-06-15T00:00:00Z',
  },
];

export const getCustomerById = (id: number): Customer | undefined => {
  return customers.find(customer => customer.id === id);
};

export const getActiveCustomers = (): Customer[] => {
  return customers.filter(customer => customer.status === 'active');
};