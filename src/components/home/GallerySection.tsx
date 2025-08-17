'use client';

import { useEffect, useState } from 'react';
import { Media } from '@prisma/client';
import Image from 'next/image';

export function GallerySection() {
  const [images, setImages] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/gallery');
        if (!response.ok) {
          throw new Error('Failed to fetch gallery');
        }
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <section id="gallery" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              A Glimpse of Our Work
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Browse through our gallery to see the stunning transformations we&apos;ve performed.
            </p>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {isLoading ? (
            <p>Loading gallery...</p>
          ) : images.length === 0 ? (
            <p>No images in the gallery yet.</p>
          ) : (
            images.map((image) => (
              <div key={image.id} className="overflow-hidden rounded-lg">
                <Image
                  src={image.url}
                  alt={image.altText || 'Gallery image'}
                  width={300}
                  height={300}
                  className="aspect-square w-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
