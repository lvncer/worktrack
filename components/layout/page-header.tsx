import { getPageTitle } from "@/lib/utils";

interface PageHeaderProps {
  path: string;
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  path,
  title,
  description,
  children,
}: PageHeaderProps) {
  const pageTitle = title || getPageTitle(path);

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">{pageTitle}</h1>
        {description && (
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </div>
      {children && <div className="mt-4 md:mt-0">{children}</div>}
    </div>
  );
}
