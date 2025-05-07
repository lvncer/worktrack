import { getProjectCategoryById } from "./project-categories";
import { getUserById } from "./users";

export interface Project {
  id: number;
  department_flag: number;
  project_category_id: number;
  project_number: string;
  name: string;
  description: string | null;
  leader_id: number | null;
  remarks: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export const projects: Project[] = [
  {
    id: 1,
    department_flag: 200,
    project_category_id: 1,
    project_number: "PRJ001",
    name: "基幹システム刷新プロジェクト",
    description:
      "既存の基幹システムを刷新し、クラウド対応の新システムを構築する",
    leader_id: 2,
    remarks: "重要度：高",
    status: "active",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: 2,
    department_flag: 200,
    project_category_id: 2,
    project_number: "PRJ002",
    name: "販売管理システム保守",
    description: "既存の販売管理システムの保守・運用",
    leader_id: 3,
    remarks: null,
    status: "active",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: 3,
    department_flag: 300,
    project_category_id: 3,
    project_number: "PRJ003",
    name: "DX推進コンサルティング",
    description: "顧客のDX推進に関するコンサルティング",
    leader_id: 4,
    remarks: null,
    status: "active",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: 4,
    department_flag: 100,
    project_category_id: 5,
    project_number: "PRJ004",
    name: "新規顧客開拓",
    description: "新規顧客の開拓活動",
    leader_id: 1,
    remarks: "年間目標：10社",
    status: "active",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: 5,
    department_flag: 400,
    project_category_id: 4,
    project_number: "PRJ005",
    name: "新入社員研修",
    description: "新入社員向けの研修プログラム",
    leader_id: null,
    remarks: null,
    status: "inactive",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-06-15T00:00:00Z",
  },
];

export const getProjectById = (id: number): Project | undefined => {
  return projects.find((project) => project.id === id);
};

export const getActiveProjects = (): Project[] => {
  return projects.filter((project) => project.status === "active");
};

export function getProjectWithDetails(projectId: number) {
  const project = getProjectById(projectId);
  if (!project) return null;

  const category = getProjectCategoryById(project.project_category_id);
  const leader = project.leader_id ? getUserById(project.leader_id) : null;

  return {
    ...project,
    category: category || null,
    leader: leader || null,
  };
}
