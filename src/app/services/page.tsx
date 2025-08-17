'use client';

import { useEffect, useState } from 'react';
import { Service, ServiceCategory } from '@prisma/client';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/CartContext';

type VehicleType = 'hatchback' | 'sedan' | 'suv7';

function ServiceCard({ service, vehicleType }: { service: Service; vehicleType: VehicleType }) {
  const { addToCart } = useCart();

  const getPrice = () => {
    if (service.category !== 'INTERIOR' || !service.vehiclePricing) {
      return service.basePrice;
    }
    const pricing = service.vehiclePricing as any;
    // The vehicle pricing in the requirements has specific keys
    const vehiclePriceKey = {
      hatchback: 'Hatchback car',
      sedan: 'Sedan/SUV 5 seater',
      suv7: 'SUV 7 Seater',
    }[vehicleType];

    return pricing[vehiclePriceKey] || service.basePrice;
  };

  const handleAddToCart = () => {
    const price = getPrice();
    addToCart(service, price);
  };

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow flex flex-col">
      <div className="p-6 flex-grow">
        <h3 className="text-lg font-bold">{service.title}</h3>
        <p className="text-sm text-muted-foreground">{service.category}</p>
        <p className="mt-4 text-3xl font-bold">${getPrice()}</p>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          {service.items.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 text-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center p-6 pt-0">
          <button
            onClick={handleAddToCart}
            className="w-full rounded-md bg-primary py-2 px-4 text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Add to Cart
          </button>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [vehicleType, setVehicleType] = useState<VehicleType>('sedan');
  const { toast } = useToast();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        if (!response.ok) throw new Error('Failed to fetch services');
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error(error);
        toast({
          title: 'Error',
          description: 'Could not fetch services. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, [toast]);

  const filterServices = (category: ServiceCategory) => services.filter(s => s.category === category);

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Our Services</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Select your vehicle type for accurate interior detailing prices.
        </p>
        <div className="mt-6">
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value as VehicleType)}
            className="max-w-xs mx-auto rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          >
            <option value="hatchback">Hatchback</option>
            <option value="sedan">Sedan / SUV 5-Seater</option>
            <option value="suv7">SUV 7-Seater</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center">Loading services...</div>
      ) : (
        <div className="space-y-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Interior Detailing</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filterServices('INTERIOR').map(service => (
                <ServiceCard key={service.id} service={service} vehicleType={vehicleType} />
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6">Exterior Detailing</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
               {filterServices('EXTERIOR').map(service => (
                <ServiceCard key={service.id} service={service} vehicleType={vehicleType} />
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6">Value Added</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
               {filterServices('ADDON').map(service => (
                <ServiceCard key={service.id} service={service} vehicleType={vehicleType} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
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
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    );
}
