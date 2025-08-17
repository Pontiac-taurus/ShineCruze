import { AdminLayout } from '@/components/admin/AdminLayout';
import { ServiceForm } from '@/components/admin/ServiceForm';

export default function NewServicePage() {
  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New Service</h1>
        <div className="p-6 border rounded-lg bg-card">
            <ServiceForm />
        </div>
      </div>
    </AdminLayout>
  );
}
