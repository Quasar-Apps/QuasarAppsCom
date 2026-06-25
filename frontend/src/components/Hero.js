import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const BANNER_URL = "https://customer-assets.emergentagent.com/job_quantum-ui-3/artifacts/jslpzjbg_9ef2d321-9f2f-46bf-a1a9-d8977af6f646.png";

const Hero = () => {
  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section 
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20"
      data-testid="hero-section"
    >
      {/* Cosmic Background Effects */}
      <div className="absolute inset-0 cosmic-bg">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D111A2]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#9D4CDD]/15 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1B93A4]/10 rounded-full blur-[150px]" />
      </div>

      {/* Banner Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 mb-8"
      >
        <img 
          src={BANNER_URL} 
          alt="Quasar Apps" 
          className="w-full max-w-2xl md:max-w-3xl h-auto object-contain"
        />
      </motion.div>

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative z-10 text-center px-6"
      >
        <p className="text-xl md:text-2xl text-[#A09DB0] max-w-2xl mx-auto mb-8 font-light">
          UX-led web and mobile development studio.
          <br />
          <span className="text-white">We transform complex ideas into elegant, intuitive products.</span>
        </p>
      </motion.div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="relative z-10 flex flex-wrap gap-4 justify-center"
      >
        <a 
          href="#contact" 
          className="btn-primary"
          data-testid="hero-cta-primary"
        >
          Start Your Project
        </a>
        <a 
          href="#case-studies" 
          className="btn-secondary"
          data-testid="hero-cta-secondary"
        >
          View Our Work
        </a>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        onClick={scrollToServices}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#A09DB0] hover:text-white transition-colors cursor-pointer"
        data-testid="scroll-indicator"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown size={32} />
        </motion.div>
      </motion.button>
    </section>
  );
};

export default Hero;
