'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { useEffect, useState, useCallback } from 'react';
import { Booking, BookingService, Service, BookingStatus } from '@prisma/client';
import { useToast } from '@/hooks/use-toast';

type PopulatedBooking = Booking & {
    services: (BookingService & { service: Service })[];
};

export default function BookingsManagementPage() {
  const [bookings, setBookings] = useState<PopulatedBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const { toast } = useToast();

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    const url = filter ? `/api/admin/bookings?status=${filter}` : '/api/admin/bookings';
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
      toast({ title: "Error", description: "Could not fetch bookings.", variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [filter, toast]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusUpdate = async (bookingId: string, endpoint: string, successMessage: string) => {
    try {
        const res = await fetch(`/api/admin/bookings/${bookingId}/${endpoint}`, { method: 'PATCH' });
        if (!res.ok) throw new Error(`Failed to ${endpoint} booking`);
        toast({ title: 'Success', description: successMessage });
        fetchBookings(); // Refetch to update the list
    } catch(error) {
        toast({ title: 'Error', description: `Could not update booking.`, variant: 'destructive' });
    }
  };

  const handleAccept = (id: string) => handleStatusUpdate(id, 'accept', 'Booking accepted.');
  const handleDeny = (id: string) => handleStatusUpdate(id, 'deny', 'Booking denied.');

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Bookings Management</h1>
      <div className="my-4">
        <select onChange={e => setFilter(e.target.value)} value={filter} className="rounded-md border p-2">
            <option value="">All Statuses</option>
            {Object.values(BookingStatus).map(status => (
                <option key={status} value={status}>{status}</option>
            ))}
        </select>
      </div>

      <div className="rounded-lg border">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
                <tr><td colSpan={5} className="text-center p-4">Loading...</td></tr>
            ) : bookings.map(booking => (
              <tr key={booking.id}>
                <td className="px-6 py-4 whitespace-nowrap">{booking.customerName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(booking.startAt).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        booking.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                        booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                        {booking.status}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">${booking.totalPrice.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {booking.status === 'PENDING' && (
                    <>
                      <button onClick={() => handleAccept(booking.id)} className="text-green-600 hover:text-green-900 mr-2">Accept</button>
                      <button onClick={() => handleDeny(booking.id)} className="text-red-600 hover:text-red-900">Deny</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
