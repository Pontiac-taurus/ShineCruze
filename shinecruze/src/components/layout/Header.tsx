import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          Shinecruze
        </Link>
        <nav>
          <ul className="flex items-center space-x-6">
            <li><Link href="/" className="text-sm font-medium transition-colors hover:text-primary">Home</Link></li>
            <li><Link href="/services" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Services</Link></li>
            <li><Link href="/gallery" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Gallery</Link></li>
            <li><Link href="/#contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Contact</Link></li>
            <li>
                <Link
                    href="/booking"
                    className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                    Book Now
                </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
