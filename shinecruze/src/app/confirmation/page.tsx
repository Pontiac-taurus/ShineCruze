import Link from 'next/link';

export default function ConfirmationPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-200px)] flex-col items-center justify-center text-center">
      <div className="space-y-4">
        <CircleCheckIcon className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="text-4xl font-bold">Booking Submitted!</h1>
        <p className="max-w-md text-muted-foreground">
          Thank you for your request. Your booking is now pending approval. You will receive an email confirmation once it's been accepted by our team.
        </p>
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

function CircleCheckIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    )
}
