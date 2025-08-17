export function ContactSection() {
  return (
    <section id="contact" className="w-full py-12 md:py-24 lg:py-32 border-t">
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
            Get in Touch
          </h2>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Have a question or want to schedule a special service? Contact us!
          </p>
        </div>
        <div className="mt-6">
            <p className="text-lg"><strong>Email:</strong> contact@shinecruze.com</p>
            <p className="text-lg"><strong>Phone:</strong> (123) 456-7890</p>
            <p className="text-lg"><strong>Address:</strong> 123 Shine St, Carville, CA 90210</p>
        </div>
      </div>
    </section>
  );
}
