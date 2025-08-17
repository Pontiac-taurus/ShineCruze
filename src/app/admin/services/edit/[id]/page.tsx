'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { ServiceForm } from '@/components/admin/ServiceForm';
import { Service } from '@prisma/client';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function EditServicePage() {
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const { toast } = useToast();

  const fetchService = useCallback(async () => {
    const id = params.id;
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/services/${id}`);
      if (!res.ok) throw new Error('Service not found');
      const data = await res.json();
      setService(data);
    } catch (error) {
      console.error("Failed to fetch service", error);
      toast({ title: 'Error', description: 'Could not fetch service details.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [params.id, toast]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Service</h1>
        <div className="p-6 border rounded-lg bg-card">
            {isLoading ? (
                <p>Loading service...</p>
            ) : service ? (
                <ServiceForm service={service} />
            ) : (
                <p>Service not found.</p>
            )}
        </div>
      </div>
    </AdminLayout>
  );
}
