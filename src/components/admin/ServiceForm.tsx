'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createServiceSchema } from '@/lib/validations/service';
import { Service, ServiceCategory } from '@prisma/client';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

type ServiceFormValues = z.infer<typeof createServiceSchema>;

interface ServiceFormProps {
  service?: Service;
}

export function ServiceForm({ service }: ServiceFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<ServiceFormValues>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: service ? {
        ...service,
        basePrice: service.basePrice,
        duration: service.duration,
        vehiclePricing: (service.vehiclePricing && typeof service.vehiclePricing === 'object' ? service.vehiclePricing : {}) as Record<string, number>,
    } : {
      title: '',
      category: 'INTERIOR',
      basePrice: 0,
      duration: 60,
      items: [''],
      vehiclePricing: { "Hatchback car": 130, "Sedan/SUV 5 seater": 150, "SUV 7 Seater": 180 },
    },
  });

  const { fields, append, remove } = useFieldArray({
      control,
      name: "items",
  });

  const onSubmit = async (data: ServiceFormValues) => {
    try {
      const response = await fetch(
        service ? `/api/admin/services/${service.id}` : '/api/admin/services',
        {
          method: service ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error('Something went wrong');
      toast({ title: 'Success', description: `Service has been ${service ? 'updated' : 'created'}.` });
      router.push('/admin/services');
      router.refresh(); // Refresh server components
    } catch {
      toast({ title: 'Error', description: 'Could not save service.', variant: 'destructive' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label>Title</label>
        <input {...register('title')} className="w-full rounded-md border p-2" />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      <div>
        <label>Category</label>
        <select {...register('category')} className="w-full rounded-md border p-2">
            {Object.values(ServiceCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
            <label>Base Price ($)</label>
            <input type="number" {...register('basePrice', { valueAsNumber: true })} className="w-full rounded-md border p-2" />
            {errors.basePrice && <p className="text-red-500 text-sm">{errors.basePrice.message}</p>}
        </div>
        <div>
            <label>Duration (minutes)</label>
            <input type="number" {...register('duration', { valueAsNumber: true })} className="w-full rounded-md border p-2" />
            {errors.duration && <p className="text-red-500 text-sm">{errors.duration.message}</p>}
        </div>
      </div>

      <div>
        <label>Included Items</label>
        {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2 mb-2">
                <input {...register(`items.${index}`)} className="w-full rounded-md border p-2" />
                <button type="button" onClick={() => remove(index)} className="text-red-500">Remove</button>
            </div>
        ))}
        <button type="button" onClick={() => append('')} className="text-sm text-blue-500">Add Item</button>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Vehicle Specific Pricing (for Interior)</h3>
        <div className="grid grid-cols-3 gap-4">
            <div>
                <label>Hatchback</label>
                <input type="number" {...register('vehiclePricing.Hatchback car', { valueAsNumber: true })} className="w-full rounded-md border p-2" />
            </div>
            <div>
                <label>Sedan/SUV 5-Seater</label>
                <input type="number" {...register('vehiclePricing.Sedan/SUV 5 seater', { valueAsNumber: true })} className="w-full rounded-md border p-2" />
            </div>
            <div>
                <label>SUV 7-Seater</label>
                <input type="number" {...register('vehiclePricing.SUV 7 Seater', { valueAsNumber: true })} className="w-full rounded-md border p-2" />
            </div>
        </div>
      </div>

      <button type="submit" disabled={isSubmitting} className="w-full rounded-md bg-primary py-2 text-primary-foreground">
        {isSubmitting ? 'Saving...' : 'Save Service'}
      </button>
    </form>
  );
}
