'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { TestimonialForm } from '@/components/admin/TestimonialForm';
import { Testimonial } from '@prisma/client';
import { useEffect, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function EditTestimonialPage({ params }: { params: { id: string } }) {
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchTestimonial = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/testimonials/${params.id}`);
      if (!res.ok) throw new Error('Testimonial not found');
      const data = await res.json();
      setTestimonial(data);
    } catch (error) {
      console.error("Failed to fetch testimonial", error);
      toast({ title: 'Error', description: 'Could not fetch testimonial details.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [params.id, toast]);

  useEffect(() => {
    fetchTestimonial();
  }, [fetchTestimonial]);

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Testimonial</h1>
        <div className="p-6 border rounded-lg bg-card">
            {isLoading ? (
                <p>Loading testimonial...</p>
            ) : testimonial ? (
                <TestimonialForm testimonial={testimonial} />
            ) : (
                <p>Testimonial not found.</p>
            )}
        </div>
      </div>
    </AdminLayout>
  );
}
