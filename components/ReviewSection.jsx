import Link from "next/link";

export default function ReviewSection() {
  return (
    <section className="relative py-12 lg:py-20 overflow-hidden bg-white">
      {/* Decorative Background Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-secondary/0 via-secondary/40 to-secondary/0"></div>
      
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="inline-block px-4 py-1 border border-secondary/30 text-secondary text-[10px] uppercase tracking-[0.4em] mb-6">
          Testimonials
        </div>
        
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-secondary text-primary mb-6 tracking-tight uppercase">
          Share Your Experience
        </h2>
        
        <p className="text-grey-medium font-main leading-relaxed mb-10 max-w-2xl mx-auto italic text-sm md:text-base">
          "Every piece we create tells a story of heritage and craftsmanship. We would be honored to hear your story and how our collection became a part of your journey."
        </p>
        
        <div className="flex flex-col items-center gap-6">
          <Link
            href="/review-page"
            className="btn-primary"
          >
            Write a Review
          </Link>
          <div className="w-12 h-px bg-secondary/20"></div>
        </div>
      </div>
    </section>
  );
}
