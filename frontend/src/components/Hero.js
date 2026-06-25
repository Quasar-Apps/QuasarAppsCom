import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const HERO_BG = "https://customer-assets.emergentagent.com/job_quantum-ui-3/artifacts/jslpzjbg_9ef2d321-9f2f-46bf-a1a9-d8977af6f646.png";
const LOGO_URL = "https://customer-assets.emergentagent.com/job_quantum-ui-3/artifacts/7pbry2i0_816de68f-f17b-4eac-a712-2b274cb965a5.png";

const Hero = () => {
  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      data-testid="hero-section"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img 
          src={HERO_BG} 
          alt="Quasar Apps" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050211]/50 to-[#050211]" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-[#D111A2]">
            UX-Led Development Studio
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tighter text-white mb-8"
          data-testid="hero-title"
        >
          We craft digital
          <br />
          <span className="gradient-text">experiences</span> that
          <br />
          transcend
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl text-[#A09DB0] max-w-xl mb-12"
        >
          Quasar Apps is a web and mobile development studio obsessed with 
          user experience. We transform complex ideas into elegant, 
          intuitive products.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-wrap gap-4"
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
      </div>

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
