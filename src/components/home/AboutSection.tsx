import Image from "next/image";

export function AboutSection() {
  return (
    <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
            Who We Are
          </h2>
          <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Shinecruze was born from a passion for automotive perfection. We are a team of dedicated professionals committed to providing the highest quality detailing services. We use only the best products and techniques to ensure your vehicle leaves looking better than new.
          </p>
        </div>
        <div className="flex justify-center">
            <Image
                src="https://via.placeholder.com/550x310"
                alt="About Us Image"
                className="overflow-hidden rounded-xl object-cover object-center"
                width={550}
                height={310}
            />
        </div>
      </div>
    </section>
  );
}
