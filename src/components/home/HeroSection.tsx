import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="bg-gray-900 text-white">
      <div className="container mx-auto flex min-h-[calc(100vh-56px)] flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          The Ultimate Shine, Every Time
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          From interior deep cleaning to exterior paint correction, we treat your car like our own. Discover the Shinecruze difference.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/booking"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Book Now
          </Link>
          <Link
            href="/services"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Our Services
          </Link>
        </div>
      </div>
    </section>
  );
}
