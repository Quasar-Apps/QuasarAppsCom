import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const HERO_BG = "https://images.pexels.com/photos/14573592/pexels-photo-14573592.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";
const LOGO_URL = "https://customer-assets.emergentagent.com/job_3cec2ff5-d333-4729-964f-f800e226e677/artifacts/3x01ffer_ChatGPT%20Image%20Mar%2031%2C%202026%2C%2005_44_24%20PM.png";

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
          alt="" 
          className="w-full h-full object-cover opacity-30 blur-sm"
        />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Floating Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[60%] md:w-[40%] pointer-events-none"
      >
        <img 
          src={LOGO_URL} 
          alt="" 
          className="w-full h-auto opacity-50 blur-[2px]"
        />
      </motion.div>

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
