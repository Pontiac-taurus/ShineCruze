'use client';

import { useEffect, useState } from 'react';
import { Service } from '@prisma/client';
import Link from 'next/link';

function ServiceCard({ service }: { service: Service }) {
    return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">{service.title}</h3>
                <p className="text-sm text-muted-foreground">{service.category}</p>
            </div>
            <div className="p-6 pt-0">
                <p className="text-4xl font-bold">${service.basePrice}</p>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {service.items.slice(0, 3).map((item) => (
                        <li key={item} className="flex items-center">
                            <CheckIcon className="mr-2 h-4 w-4" /> {item}
                        </li>
                    ))}
                    {service.items.length > 3 && <li>... and more</li>}
                </ul>
            </div>
        </div>
    );
}

export function ServicesHighlight() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setServices(data.slice(0, 3));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <section id="services" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Our Signature Services
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Choose from our curated list of detailing services to give your car the treatment it deserves.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-stretch gap-8 py-12 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
          {isLoading ? (
            <p>Loading services...</p>
          ) : (
            services.map(service => <ServiceCard key={service.id} service={service} />)
          )}
        </div>
        <div className="flex justify-center">
            <Link href="/services" className="text-primary hover:underline">
                View All Services
            </Link>
        </div>
      </div>
    </section>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
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
        className="h-4 w-4"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    );
}
