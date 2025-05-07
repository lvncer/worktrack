'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { addWorkLog, updateWorkLog, getWorkLogWithDetails, WorkLog, WorkStatus } from '@/lib/data/work-logs';
import { getActiveCustomers } from '@/lib/data/customers';
import { getActiveProjects } from '@/lib/data/projects';
import { getWorkCategoriesByDepartmentFlag } from '@/lib/data/work-categories';
import { getWorkSubCategoriesByDepartmentFlag } from '@/lib/data/work-sub-categories';

const formSchema = z.object({
  customer_id: z.coerce.number(),
  work_date: z.string(),
  start_time: z.string(),
  end_time: z.string().optional().nullable(),
  work_category_id: z.coerce.number().optional().nullable(),
  work_sub_category_id: z.coerce.number().optional().nullable(),
  project_id: z.coerce.number().optional().nullable(),
  project_name_input: z.string().optional().nullable(),
  customer_contact: z.string().optional().nullable(),
  work_details: z.string().min(1, '作業内容は必須です'),
  work_status: z.enum(['完了', '継続']),
  memo: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

interface WorkFormProps {
  userId: number;
  departmentId: number;
  departmentFlag: number;
  workLogId?: number;
  isEdit?: boolean;
}

export function WorkForm({ userId, departmentId, departmentFlag, workLogId, isEdit = false }: WorkFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  const [customers, setCustomers] = useState(getActiveCustomers());
  const [projects, setProjects] = useState(getActiveProjects());
  const [categories, setCategories] = useState(getWorkCategoriesByDepartmentFlag(departmentFlag));
  const [subCategories, setSubCategories] = useState(getWorkSubCategoriesByDepartmentFlag(departmentFlag));
  
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer_id: 0,
      work_date: new Date().toISOString().split('T')[0],
      start_time: '09:00',
      end_time: '',
      work_category_id: null,
      work_sub_category_id: null,
      project_id: null,
      project_name_input: '',
      customer_contact: '',
      work_details: '',
      work_status: '完了',
      memo: '',
    },
  });

  useEffect(() => {
    if (isEdit && workLogId) {
      const workLog = getWorkLogWithDetails(workLogId);
      if (workLog) {
        form.reset({
          customer_id: workLog.customer_id,
          work_date: workLog.work_date,
          start_time: workLog.start_time.substring(0, 5),
          end_time: workLog.end_time ? workLog.end_time.substring(0, 5) : null,
          work_category_id: workLog.work_category_id,
          work_sub_category_id: workLog.work_sub_category_id,
          project_id: workLog.project_id,
          project_name_input: workLog.project_name_input,
          customer_contact: workLog.customer_contact,
          work_details: workLog.work_details || '',
          work_status: workLog.work_status,
          memo: workLog.memo,
        });
      }
    }
  }, [isEdit, workLogId, form]);

  const onSubmit = (data: FormValues) => {
    setShowConfirmDialog(true);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    
    try {
      const formData = form.getValues();
      
      const workLogData = {
        user_id: userId,
        department_id: departmentId,
        customer_id: formData.customer_id,
        work_date: formData.work_date,
        start_time: formData.start_time + ':00',
        end_time: formData.end_time ? formData.end_time + ':00' : null,
        work_category_id: formData.work_category_id,
        work_sub_category_id: formData.work_sub_category_id,
        project_id: formData.project_id,
        project_name_input: formData.project_name_input,
        customer_contact: formData.customer_contact,
        work_details: formData.work_details,
        work_status: formData.work_status as WorkStatus,
        memo: formData.memo,
      };
      
      if (isEdit && workLogId) {
        updateWorkLog(workLogId, workLogData);
        toast({
          title: '更新完了',
          description: '作業内容が更新されました',
        });
      } else {
        addWorkLog(workLogData as Omit<WorkLog, 'id' | 'created_at' | 'updated_at'>);
        toast({
          title: '登録完了',
          description: '作業内容が登録されました',
        });
      }
      
      router.push('/work');
    } catch (error) {
      toast({
        title: 'エラー',
        description: '保存中にエラーが発生しました',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
      setShowConfirmDialog(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="customer_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>顧客名 *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="顧客を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id.toString()}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customer_contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>顧客担当者</FormLabel>
                  <FormControl>
                    <Input placeholder="担当者名" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="work_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>作業日 *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>開始時間 *</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>終了時間</FormLabel>
                    <FormControl>
                      <Input 
                        type="time" 
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormDescription>
                      継続中の場合は空欄
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="work_category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>作業カテゴリ</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="カテゴリを選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="work_sub_category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>サブカテゴリ</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="サブカテゴリを選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subCategories.map((subCategory) => (
                        <SelectItem key={subCategory.id} value={subCategory.id.toString()}>
                          {subCategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="project_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>案件</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="案件を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id.toString()}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="project_name_input"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>案件名（リストにない場合）</FormLabel>
                  <FormControl>
                    <Input placeholder="案件名" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormDescription>
                    リストにない場合のみ入力
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="work_details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>作業内容 *</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="作業内容を入力してください" 
                    {...field}
                    className="min-h-[120px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="work_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>作業状況 *</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-row space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="完了" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">完了</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="継続" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">継続</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="memo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>メモ</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="備考や引き継ぎ事項など" 
                    {...field}
                    value={field.value || ''}
                    className="min-h-[80px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/work')}
            >
              キャンセル
            </Button>
            <Button type="submit">
              {isEdit ? '更新する' : '登録する'}
            </Button>
          </div>
        </form>
      </Form>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEdit ? '作業内容を更新' : '作業内容を登録'}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? '作業内容を更新します。よろしいですか？'
                : '入力した内容で登録します。よろしいですか？'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isSubmitting}
            >
              キャンセル
            </Button>
            <Button onClick={handleConfirm} disabled={isSubmitting}>
              {isSubmitting ? '処理中...' : '確定'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}