import { AdminLayout } from '@/components/admin/AdminLayout';
import { TestimonialForm } from '@/components/admin/TestimonialForm';

export default function NewTestimonialPage() {
  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New Testimonial</h1>
        <div className="p-6 border rounded-lg bg-card">
          <TestimonialForm />
        </div>
      </div>
    </AdminLayout>
  );
}
