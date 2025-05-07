'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Download, Search, BarChart2, PieChart as PieChartIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  filterWorkLogs, 
  getWorkLogWithDetails,
  calculateWorkHours
} from '@/lib/data/work-logs';
import { getActiveDepartments } from '@/lib/data/departments';
import { getActiveCustomers } from '@/lib/data/customers';
import { getUsersByDepartmentId } from '@/lib/data/users';
import { getActiveProjects } from '@/lib/data/projects';
import { jsonToCSV, downloadCSV } from '@/lib/utils';

// 集計タイプ
type AggregationType = 'customer' | 'project' | 'category' | 'user' | 'date';

export default function AggregationPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // 設定データ
  const departments = getActiveDepartments();
  const customers = getActiveCustomers();
  const projects = getActiveProjects();
  const [users, setUsers] = useState<any[]>([]);
  
  // フィルター条件
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    departmentId: 0,
    userId: 0,
    customerId: 0,
    projectId: 0,
  });
  
  // 集計タイプと結果
  const [aggregationType, setAggregationType] = useState<AggregationType>('customer');
  const [aggregationResults, setAggregationResults] = useState<any[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // カラーパレット
  const COLORS = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
  ];
  
  useEffect(() => {
    if (!user) return;
    
    // デフォルトで自部署のユーザーをロード
    setUsers(getUsersByDepartmentId(user.department_id));
    
    // 初期フィルターを設定
    setFilters(prev => ({
      ...prev,
      departmentId: prev.departmentId || user.department_id,
    }));
  }, [user]);
  
  const handleFilterChange = (name: string, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    
    // 部署が変わったらユーザーリストを更新
    if (name === 'departmentId' && value) {
      setUsers(getUsersByDepartmentId(parseInt(value)));
      setFilters(prev => ({ ...prev, userId: 0 }));
    }
  };
  
  const handleSearch = () => {
    setLoading(true);
    
    try {
      // フィルター適用
      const appliedFilters: any = {};
      if (filters.startDate) appliedFilters.startDate = filters.startDate;
      if (filters.endDate) appliedFilters.endDate = filters.endDate;
      if (filters.departmentId) appliedFilters.departmentId = parseInt(filters.departmentId.toString());
      if (filters.userId) appliedFilters.userId = parseInt(filters.userId.toString());
      if (filters.customerId) appliedFilters.customerId = parseInt(filters.customerId.toString());
      if (filters.projectId) appliedFilters.projectId = parseInt(filters.projectId.toString());
      
      const filteredLogs = filterWorkLogs(appliedFilters);
      const logsWithDetails = filteredLogs.map(log => getWorkLogWithDetails(log.id)).filter(Boolean);
      
      // 集計データを計算
      aggregateData(logsWithDetails);
    } catch (error) {
      console.error('Error searching:', error);
      toast({
        title: 'エラー',
        description: 'データの集計中にエラーが発生しました',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const aggregateData = (logs: any[]) => {
    if (!logs.length) {
      setAggregationResults([]);
      setTotalHours(0);
      return;
    }
    
    // 各ログの作業時間を計算
    const logsWithHours = logs.map(log => ({
      ...log,
      hours: calculateWorkHours(log) || 0
    }));
    
    // 合計時間を計算
    const total = logsWithHours.reduce((sum, log) => sum + log.hours, 0);
    setTotalHours(total);
    
    // 選択された集計タイプに応じてデータを集計
    const aggregated = new Map();
    
    logsWithHours.forEach(log => {
      let key;
      let name;
      
      switch (aggregationType) {
        case 'customer':
          key = log.customer?.id;
          name = log.customer?.name || '不明';
          break;
        case 'project':
          key = log.project?.id || log.project_name_input;
          name = log.project?.name || log.project_name_input || '未指定';
          break;
        case 'category':
          key = log.workCategory?.id;
          name = log.workCategory?.name || '未分類';
          break;
        case 'user':
          key = log.user?.id;
          name = log.user?.name || '不明';
          break;
        case 'date':
          key = log.work_date;
          name = log.work_date;
          break;
        default:
          key = 'unknown';
          name = '不明';
      }
      
      if (!key) {
        key = 'unknown';
        name = '未分類';
      }
      
      if (aggregated.has(key)) {
        const item = aggregated.get(key);
        item.hours += log.hours;
        item.count += 1;
      } else {
        aggregated.set(key, {
          id: key,
          name,
          hours: log.hours,
          count: 1,
          percentage: 0
        });
      }
    });
    
    // パーセンテージを計算
    aggregated.forEach(item => {
      item.percentage = total > 0 ? (item.hours / total * 100).toFixed(1) : 0;
    });
    
    // 結果を配列に変換し、降順でソート
    const results = Array.from(aggregated.values()).sort((a, b) => b.hours - a.hours);
    setAggregationResults(results);
  };
  
  const handleExportCSV = () => {
    if (!aggregationResults.length) {
      toast({
        title: '警告',
        description: 'エクスポートするデータがありません',
        variant: 'destructive',
      });
      return;
    }
    
    const csvData = aggregationResults.map(item => ({
      名称: item.name,
      作業時間: item.hours.toFixed(2),
      パーセンテージ: `${item.percentage}%`,
      件数: item.count
    }));
    
    const startDate = filters.startDate ? new Date(filters.startDate).toLocaleDateString('ja-JP') : '';
    const endDate = filters.endDate ? new Date(filters.endDate).toLocaleDateString('ja-JP') : '';
    const filename = `工数集計_${aggregationType}_${startDate}〜${endDate}.csv`;
    
    const csvString = jsonToCSV(csvData);
    downloadCSV(csvString, filename);
    
    toast({
      title: 'エクスポート完了',
      description: 'データがCSVファイルとしてエクスポートされました',
    });
  };
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-8">
      <PageHeader path="/aggregation" description="期間や条件を指定して工数を集計します" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">集計条件</CardTitle>
              <CardDescription>期間と条件を指定してください</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aggregationType">集計タイプ</Label>
                <Select
                  value={aggregationType}
                  onValueChange={(value) => setAggregationType(value as AggregationType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="集計タイプを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">顧客別</SelectItem>
                    <SelectItem value="project">案件別</SelectItem>
                    <SelectItem value="category">カテゴリ別</SelectItem>
                    <SelectItem value="user">担当者別</SelectItem>
                    <SelectItem value="date">日付別</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">開始日</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">終了日</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="departmentId">部署</Label>
                <Select
                  value={filters.departmentId.toString()}
                  onValueChange={(value) => handleFilterChange('departmentId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="部署を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">すべての部署</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="userId">担当者</Label>
                <Select
                  value={filters.userId.toString()}
                  onValueChange={(value) => handleFilterChange('userId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="担当者を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">すべての担当者</SelectItem>
                    {users.map((u) => (
                      <SelectItem key={u.id} value={u.id.toString()}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customerId">顧客</Label>
                <Select
                  value={filters.customerId.toString()}
                  onValueChange={(value) => handleFilterChange('customerId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="顧客を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">すべての顧客</SelectItem>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id.toString()}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="projectId">案件</Label>
                <Select
                  value={filters.projectId.toString()}
                  onValueChange={(value) => handleFilterChange('projectId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="案件を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">すべての案件</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id.toString()}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleSearch} 
                className="w-full mt-4"
                disabled={loading}
              >
                <Search className="mr-2 h-4 w-4" />
                {loading ? '集計中...' : '集計する'}
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl">集計結果</CardTitle>
                <CardDescription>
                  {filters.startDate && filters.endDate
                    ? `${new Date(filters.startDate).toLocaleDateString('ja-JP')} 〜 ${new Date(filters.endDate).toLocaleDateString('ja-JP')}`
                    : '期間指定なし'}
                  {' / '}
                  {totalHours > 0 ? `合計: ${totalHours.toFixed(2)}時間` : ''}
                </CardDescription>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                disabled={!aggregationResults.length}
              >
                <Download className="mr-2 h-4 w-4" />
                CSV出力
              </Button>
            </CardHeader>
            
            <CardContent className="flex-grow pb-0">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : aggregationResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <Search className="h-12 w-12 mb-4 opacity-20" />
                  <p>データがありません。条件を選択して集計してください。</p>
                </div>
              ) : (
                <Tabs defaultValue="chart" className="h-full flex flex-col">
                  <div className="flex justify-center mb-4">
                    <TabsList>
                      <TabsTrigger value="chart" className="flex items-center">
                        <BarChart2 className="h-4 w-4 mr-2" />
                        グラフ
                      </TabsTrigger>
                      <TabsTrigger value="pie" className="flex items-center">
                        <PieChartIcon className="h-4 w-4 mr-2" />
                        円グラフ
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="chart" className="flex-grow">
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={aggregationResults.slice(0, 10)}
                          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                          <XAxis 
                            dataKey="name" 
                            angle={-45} 
                            textAnchor="end" 
                            height={70}
                            interval={0}
                          />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value.toFixed(2)} 時間`, '作業時間']} />
                          <Legend verticalAlign="top" />
                          <Bar 
                            dataKey="hours" 
                            name="作業時間" 
                            fill="hsl(var(--chart-1))"
                            animationDuration={500}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="pie" className="flex-grow">
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={aggregationResults.slice(0, 5)}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="hours"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                            animationDuration={500}
                          >
                            {aggregationResults.slice(0, 5).map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={COLORS[index % COLORS.length]} 
                              />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => `${value.toFixed(2)} 時間`}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
            
            {aggregationResults.length > 0 && (
              <div className="p-6 pt-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">名称</th>
                      <th className="text-right py-2 font-medium">作業時間</th>
                      <th className="text-right py-2 font-medium">割合</th>
                      <th className="text-right py-2 font-medium">件数</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aggregationResults.map((result, index) => (
                      <tr key={index} className="border-b border-muted">
                        <td className="py-2">{result.name}</td>
                        <td className="text-right py-2">{result.hours.toFixed(2)} 時間</td>
                        <td className="text-right py-2">{result.percentage}%</td>
                        <td className="text-right py-2">{result.count} 件</td>
                      </tr>
                    ))}
                    <tr className="font-medium">
                      <td className="py-2">合計</td>
                      <td className="text-right py-2">{totalHours.toFixed(2)} 時間</td>
                      <td className="text-right py-2">100%</td>
                      <td className="text-right py-2">
                        {aggregationResults.reduce((sum, item) => sum + item.count, 0)} 件
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}