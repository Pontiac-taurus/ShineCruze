'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { useEffect, useState, useCallback } from 'react';
import { Testimonial } from '@prisma/client';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchTestimonials = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/testimonials');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setTestimonials(data);
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Could not fetch testimonials.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
      toast({ title: 'Success', description: 'Testimonial deleted.' });
      fetchTestimonials();
    } catch (error) {
      toast({ title: 'Error', description: 'Could not delete testimonial.', variant: 'destructive' });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Testimonials</h1>
        <Link href="/admin/testimonials/new" className="rounded-md bg-primary px-4 py-2 text-primary-foreground">
          Create New
        </Link>
      </div>

      <div className="rounded-lg border">
        <table className="min-w-full">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Quote</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Visible</th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {isLoading ? (
                  <tr><td colSpan={4} className="text-center p-4">Loading...</td></tr>
              ) : testimonials.map(testimonial => (
                <tr key={testimonial.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{testimonial.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap max-w-sm truncate">{testimonial.quote}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{testimonial.isVisible ? 'Yes' : 'No'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Link href={`/admin/testimonials/edit/${testimonial.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                    <button onClick={() => handleDelete(testimonial.id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </AdminLayout>
  );
}
