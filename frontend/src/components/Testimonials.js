import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Quasar Apps transformed our vision into reality. Their attention to UX detail was exceptional, and they delivered a product that exceeded our expectations.",
    author: "Sarah Chen",
    role: "CEO, NeoBank Pro",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=srgb&fm=jpg&q=85&w=100",
  },
  {
    quote: "The audio quality and UX are unmatched. Quasar truly understood our vision for the future of music streaming and brought it to life beautifully.",
    author: "Marcus Webb",
    role: "Founder, BeatStream Inc.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=srgb&fm=jpg&q=85&w=100",
  },
  {
    quote: "This dashboard has transformed how we operate. It's like having a command center for our entire business. Truly a game-changer for our team.",
    author: "James Morrison",
    role: "CTO, TechCorp Global",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=srgb&fm=jpg&q=85&w=100",
  },
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section 
      className="py-24 md:py-32 px-6 md:px-12 lg:px-24"
      data-testid="testimonials-section"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.2em] uppercase text-[#9D4CDD] mb-4 block">
            Testimonials
          </span>
          <h2 className="text-4xl sm:text-5xl font-light tracking-tight text-white">
            What Our Clients Say
          </h2>
        </motion.div>

        <div className="relative">
          <div className="glass-card p-10 md:p-16 testimonial-glass min-h-[300px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                <Quote 
                  size={48} 
                  className="text-[#D111A2]/20 mb-6"
                />
                <blockquote 
                  className="text-xl md:text-2xl font-light text-white leading-relaxed mb-10"
                  data-testid="testimonial-quote"
                >
                  {testimonials[current].quote}
                </blockquote>
                <div className="flex items-center gap-4">
                  <img 
                    src={testimonials[current].image}
                    alt={testimonials[current].author}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#D111A2]/30"
                  />
                  <div>
                    <p className="text-white font-medium">
                      {testimonials[current].author}
                    </p>
                    <p className="text-[#68647D] text-sm">
                      {testimonials[current].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors relative z-10"
              data-testid="testimonial-prev-btn"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} className="text-white" />
            </button>
            
            <div className="flex items-center gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === current 
                      ? "w-8 bg-[#D111A2]" 
                      : "bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={next}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors relative z-10"
              data-testid="testimonial-next-btn"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
