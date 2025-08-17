import { Resend } from 'resend';
import { Booking, Service, BookingService } from '@prisma/client';

const resend = new Resend(process.env.RESEND_API_KEY);

type PopulatedBooking = Booking & {
    services: (BookingService & { service: Service })[];
};

export async function sendBookingConfirmationEmail(booking: PopulatedBooking) {
  const { customerName, customerEmail, id, totalPrice, startAt } = booking;
  const subject = `Booking Confirmation - #${id.slice(0, 6)}`;
  const text = `Hi ${customerName},\n\nThank you for your booking! Your booking for ${new Date(startAt).toLocaleString()} is pending approval.\n\nTotal: $${totalPrice.toFixed(2)}\n\nWe will notify you once it's confirmed.\n\nThanks,\nThe Shinecruze Team`;

  try {
    await resend.emails.send({
      from: 'Shinecruze <noreply@yourdomain.com>', // Replace with your domain
      to: customerEmail,
      subject: subject,
      text: text,
    });
  } catch (error) {
    console.error('Failed to send confirmation email', error);
  }
}

export async function sendAdminNewBookingNotification(booking: PopulatedBooking) {
    const adminEmail = process.env.ADMIN_EMAIL; // Add this to your .env
    if (!adminEmail) {
        console.error('ADMIN_EMAIL not set, skipping notification.');
        return;
    }

    const { id, customerName, startAt, totalPrice } = booking;
    const subject = `New Booking Received - #${id.slice(0, 6)}`;
    const text = `A new booking has been received from ${customerName} for ${new Date(startAt).toLocaleString()}.\n\nTotal: $${totalPrice.toFixed(2)}\n\nPlease log in to the admin panel to accept or deny it.`;

    try {
        await resend.emails.send({
            from: 'Shinecruze Admin <noreply@yourdomain.com>',
            to: adminEmail,
            subject: subject,
            text: text,
        });
    } catch (error) {
        console.error('Failed to send admin notification', error);
    }
}

export async function sendBookingStatusUpdateEmail(booking: Booking, status: 'ACCEPTED' | 'DENIED') {
    const { customerName, customerEmail, id, startAt } = booking;
    const subject = `Booking ${status === 'ACCEPTED' ? 'Confirmed' : 'Denied'} - #${id.slice(0, 6)}`;
    const text = `Hi ${customerName},\n\nThis is an update on your booking for ${new Date(startAt).toLocaleString()}.\n\nYour booking has been ${status.toLowerCase()}.\n\n${status === 'ACCEPTED' ? 'We look forward to seeing you!' : 'Please contact us if you have any questions.'}\n\nThanks,\nThe Shinecruze Team`;

    try {
        await resend.emails.send({
            from: 'Shinecruze <noreply@yourdomain.com>',
            to: customerEmail,
            subject: subject,
            text: text,
        });
    } catch (error) {
        console.error(`Failed to send ${status.toLowerCase()} email`, error);
    }
}
