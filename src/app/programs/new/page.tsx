'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/app/components/ui/form';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import Link from 'next/link';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['PER_DOLLAR', 'PER_UNIT'], {
    required_error: 'Please select a program type',
  }),
  rate: z.string().min(1, 'Rate is required').refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Rate must be a positive number',
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewProgramPage() {
  const router = useRouter();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: undefined,
      rate: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await fetch('/api/programs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          type: data.type,
          rate: parseFloat(data.rate),
        }),
      });

      if (response.ok) {
        router.push('/');
      } else {
        console.error('Failed to create program');
      }
    } catch (error) {
      console.error('Error creating program:', error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Create New Program</h1>
        <Link href="/">
          <Button variant="outline">Back to Programs</Button>
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Program Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter program name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select program type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PER_DOLLAR">Per Dollar</SelectItem>
                          <SelectItem value="PER_UNIT">Per Unit</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rate</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.0001" 
                          placeholder="Enter rate" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Creating...' : 'Create Program'}
                  </Button>
                  <Link href="/">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}