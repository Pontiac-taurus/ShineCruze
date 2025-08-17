'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

// --- Step 1: Customer Details Form ---
const customerDetailsSchema = z.object({
    customerName: z.string().min(2, 'Name is required'),
    customerEmail: z.string().email('A valid email is required'),
    customerPhone: z.string().min(10, 'A valid phone number is required'),
    customerAddress: z.string().min(5, 'Address is required'),
});
type CustomerDetailsForm = z.infer<typeof customerDetailsSchema>;

function CustomerDetailsStep({ onNext }: { onNext: (data: CustomerDetailsForm) => void }) {
    const { register, handleSubmit, formState: { errors } } = useForm<CustomerDetailsForm>({
        resolver: zodResolver(customerDetailsSchema),
    });

    return (
        <form onSubmit={handleSubmit(onNext)} className="space-y-4">
            <div>
                <label htmlFor="customerName">Full Name</label>
                <input id="customerName" {...register('customerName')} className="w-full rounded-md border p-2" />
                {errors.customerName && <p className="text-red-500 text-sm">{errors.customerName.message}</p>}
            </div>
            <div>
                <label htmlFor="customerEmail">Email</label>
                <input id="customerEmail" {...register('customerEmail')} className="w-full rounded-md border p-2" />
                {errors.customerEmail && <p className="text-red-500 text-sm">{errors.customerEmail.message}</p>}
            </div>
             <div>
                <label htmlFor="customerPhone">Phone</label>
                <input id="customerPhone" {...register('customerPhone')} className="w-full rounded-md border p-2" />
                {errors.customerPhone && <p className="text-red-500 text-sm">{errors.customerPhone.message}</p>}
            </div>
             <div>
                <label htmlFor="customerAddress">Address</label>
                <input id="customerAddress" {...register('customerAddress')} className="w-full rounded-md border p-2" />
                {errors.customerAddress && <p className="text-red-500 text-sm">{errors.customerAddress.message}</p>}
            </div>
            <button type="submit" className="w-full rounded-md bg-primary py-2 text-primary-foreground">Next</button>
        </form>
    );
}

// --- Step 2: Date & Time ---
function DateTimeStep({ onBack, onNext }: { onBack: () => void; onNext: (data: { startAt: Date }) => void; }) {
    // Placeholder for a real calendar component
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleDateChange = async (date: Date) => {
        setSelectedDate(date);
        setIsLoading(true);
        try {
            const dateString = date.toISOString().split('T')[0];
            const response = await fetch(`/api/availability?date=${dateString}`);
            const data = await response.json();
            setAvailableSlots(data);
        } catch (error) {
            console.error("Failed to fetch availability");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            {/* Replace with a real calendar component like react-day-picker */}
            <p>Select a date:</p>
            <input type="date" onChange={e => handleDateChange(new Date(e.target.value))} className="w-full rounded-md border p-2 mb-4" />

            {isLoading && <p>Loading slots...</p>}

            <div className="grid grid-cols-4 gap-2">
                {availableSlots.map(slot => (
                    <button key={slot} onClick={() => onNext({ startAt: new Date(slot) })} className="p-2 border rounded hover:bg-gray-100">
                        {new Date(slot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </button>
                ))}
            </div>

            <div className="flex justify-between mt-4">
              <button onClick={onBack} className="rounded-md bg-gray-200 py-2 px-4">Back</button>
            </div>
        </div>
    );
}


// --- Step 3: Confirmation ---
function ConfirmationStep({ bookingData, onBack, onConfirm }: { bookingData: any, onBack: () => void; onConfirm: () => void; }) {
    const { getCartTotal, cartItems } = useCart();

    return (
        <div className="space-y-4">
            <h3 className="font-bold">Confirm Your Details</h3>
            <p>Name: {bookingData.customer.customerName}</p>
            <p>Email: {bookingData.customer.customerEmail}</p>
            <p>Time: {new Date(bookingData.dateTime.startAt).toLocaleString()}</p>
            <h3 className="font-bold mt-4">Services</h3>
            <ul>{cartItems.map(i => <li key={i.id}>{i.title} - ${i.price}</li>)}</ul>
            <p className="font-bold mt-2">Total: ${getCartTotal()}</p>
            <div className="flex justify-between mt-4">
                <button onClick={onBack} className="rounded-md bg-gray-200 py-2 px-4">Back</button>
                <button onClick={onConfirm} className="rounded-md bg-green-500 py-2 px-4 text-white">Confirm Booking</button>
            </div>
        </div>
    );
}

export default function BookingPage() {
  const { cartItems, getCartTotal, removeFromCart, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({});
  const { toast } = useToast();
  const router = useRouter();

  const handleNextFromDetails = (data: CustomerDetailsForm) => {
    setBookingData(prev => ({ ...prev, customer: data }));
    setCurrentStep(2);
  };

  const handleNextFromDateTime = (data: { startAt: Date }) => {
    const totalDuration = cartItems.reduce((acc, item) => acc + item.duration, 0);
    const endAt = new Date(data.startAt.getTime() + totalDuration * 60000);
    setBookingData(prev => ({ ...prev, dateTime: { ...data, endAt } }));
    setCurrentStep(3);
  };

  const handleConfirmBooking = async () => {
    const finalData = {
        ...(bookingData as any).customer,
        ...(bookingData as any).dateTime,
        totalPrice: getCartTotal(),
        services: cartItems.map(item => ({ serviceId: item.id, price: item.price })),
    };

    try {
        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalData),
        });

        if (!response.ok) throw new Error('Booking failed');

        toast({ title: "Booking successful!", description: "Check your email for confirmation." });
        clearCart();
        router.push('/confirmation'); // Redirect to a confirmation page
    } catch (error) {
        toast({ title: "Error", description: "Something went wrong.", variant: 'destructive' });
    }
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Book Your Service</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 p-6 border rounded-lg">
          {currentStep === 1 && <CustomerDetailsStep onNext={handleNextFromDetails} />}
          {currentStep === 2 && <DateTimeStep onBack={() => setCurrentStep(1)} onNext={handleNextFromDateTime} />}
          {currentStep === 3 && <ConfirmationStep bookingData={bookingData} onBack={() => setCurrentStep(2)} onConfirm={handleConfirmBooking} />}
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <ul className="space-y-2">
                {cartItems.map(item => (
                  <li key={item.id} className="flex justify-between items-center">
                    <span>{item.title}</span>
                    <span>${item.price}</span>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 font-bold">X</button>
                  </li>
                ))}
              </ul>
              <hr className="my-4" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
