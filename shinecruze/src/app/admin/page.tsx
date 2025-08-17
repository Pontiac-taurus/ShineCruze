'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// A simple card for displaying stats
function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
    return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex flex-row items-center justify-between pb-2">
                <h3 className="text-sm font-medium tracking-tight">{title}</h3>
                {icon}
            </div>
            <div className="text-2xl font-bold">{value}</div>
        </div>
    );
}

export default function AdminDashboardPage() {
    const { status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState({ upcoming: 0, pending: 0, completed: 0 });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.replace('/admin/login');
        }
    }, [status, router]);

    // In a real app, you'd fetch these stats from an API endpoint
    useEffect(() => {
        // Mock data
        setStats({ upcoming: 12, pending: 5, completed: 128 });
    }, []);

    if (status !== 'authenticated') {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

  return (
    <AdminLayout>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Upcoming Bookings" value={stats.upcoming.toString()} icon={<span>📅</span>} />
        <StatCard title="Pending Approvals" value={stats.pending.toString()} icon={<span>🕒</span>} />
        <StatCard title="Completed This Month" value={stats.completed.toString()} icon={<span>✅</span>} />
        <StatCard title="Total Revenue (Month)" value="$4,250" icon={<span>💰</span>} />
      </div>
      <div className="mt-8">
        {/* Placeholder for recent bookings table */}
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="rounded-lg border">
            <p className="p-4">Recent bookings would be displayed here in a table.</p>
        </div>
      </div>
    </AdminLayout>
  );
}
