import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const ICON_URL = "https://customer-assets.emergentagent.com/job_quantum-ui-3/artifacts/7pbry2i0_816de68f-f17b-4eac-a712-2b274cb965a5.png";

const Hero = () => {
  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section 
      className="relative min-h-screen flex items-center overflow-hidden"
      data-testid="hero-section"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#D111A2]/20 rounded-full blur-[150px]"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.3 }}
          className="absolute bottom-[-30%] left-[-20%] w-[600px] h-[600px] bg-[#9D4CDD]/15 rounded-full blur-[120px]"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.6 }}
          className="absolute top-[20%] left-[30%] w-[400px] h-[400px] bg-[#1B93A4]/10 rounded-full blur-[100px]"
        />
      </div>

      {/* Floating Icon - Large decorative element */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: 100 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute right-[-5%] md:right-[5%] top-[15%] md:top-[20%] -translate-y-1/2 w-[50%] md:w-[35%] pointer-events-none z-0"
      >
        <motion.img 
          src={ICON_URL} 
          alt="" 
          className="w-full h-auto opacity-60"
          animate={{ 
            y: [0, -20, 0],
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        {/* Glow effect behind icon */}
        <div className="absolute inset-0 bg-[#D111A2]/30 blur-[80px] -z-10" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-5xl pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs tracking-[0.3em] uppercase text-[#D111A2]">
            UX-Led Development Studio
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tighter text-white mb-8 leading-[1.1]"
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
          className="text-lg md:text-xl text-[#A09DB0] max-w-xl mb-12 leading-relaxed"
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
        transition={{ delay: 1.5 }}
        onClick={scrollToServices}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#A09DB0] hover:text-white transition-colors cursor-pointer z-20"
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
