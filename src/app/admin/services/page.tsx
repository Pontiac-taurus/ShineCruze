'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { useEffect, useState, useCallback } from 'react';
import { Service } from '@prisma/client';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/services');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setServices(data);
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Could not fetch services.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
        return;
    }

    try {
      const res = await fetch(`/api/admin/services/${serviceId}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete');
      }
      toast({ title: 'Success', description: 'Service deleted successfully.' });
      fetchServices(); // Refresh list
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Could not delete service.';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Services</h1>
        <Link href="/admin/services/new" className="rounded-md bg-primary px-4 py-2 text-primary-foreground">
          Create New Service
        </Link>
      </div>

      <div className="rounded-lg border">
        <table className="min-w-full">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Price</th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {isLoading ? (
                  <tr><td colSpan={4} className="text-center p-4">Loading...</td></tr>
              ) : services.map(service => (
                <tr key={service.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{service.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{service.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${service.basePrice.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Link href={`/admin/services/edit/${service.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                    <button onClick={() => handleDelete(service.id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </AdminLayout>
  );
}
