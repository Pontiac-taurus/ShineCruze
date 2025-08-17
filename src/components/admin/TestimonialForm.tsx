'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { testimonialSchema } from '@/lib/validations/testimonial';
import { Testimonial } from '@prisma/client';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

interface TestimonialFormProps {
  testimonial?: Testimonial;
}

export function TestimonialForm({ testimonial }: TestimonialFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: testimonial || {
      name: '',
      quote: '',
      rating: 5,
      isVisible: false,
    },
  });

  const onSubmit = async (data: TestimonialFormValues) => {
    try {
      const response = await fetch(
        testimonial ? `/api/admin/testimonials/${testimonial.id}` : '/api/admin/testimonials',
        {
          method: testimonial ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error('Something went wrong');
      toast({ title: 'Success', description: `Testimonial has been ${testimonial ? 'updated' : 'created'}.` });
      router.push('/admin/testimonials');
      router.refresh();
    } catch (e) {
      toast({ title: 'Error', description: 'Could not save testimonial.', variant: 'destructive' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label>Customer Name</label>
        <input {...register('name')} className="w-full rounded-md border p-2" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div>
        <label>Quote</label>
        <textarea {...register('quote')} className="w-full rounded-md border p-2" rows={4} />
        {errors.quote && <p className="text-red-500 text-sm">{errors.quote.message}</p>}
      </div>

       <div>
        <label>Rating (1-5)</label>
        <input type="number" {...register('rating', { valueAsNumber: true })} className="w-full rounded-md border p-2" />
        {errors.rating && <p className="text-red-500 text-sm">{errors.rating.message}</p>}
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" {...register('isVisible')} id="isVisible" className="h-4 w-4" />
        <label htmlFor="isVisible">Visible on public site</label>
      </div>

      <button type="submit" disabled={isSubmitting} className="w-full rounded-md bg-primary py-2 text-primary-foreground">
        {isSubmitting ? 'Saving...' : 'Save Testimonial'}
      </button>
    </form>
  );
}
