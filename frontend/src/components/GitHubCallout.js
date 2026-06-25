import { motion } from "framer-motion";
import { Github, ArrowRight } from "lucide-react";

const GitHubCallout = () => {
  return (
    <section className="py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <motion.a
          href="https://github.com/QuasarApps"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="block group"
          data-testid="github-callout"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a2e] to-[#0d0d1a] border border-white/10 p-8 md:p-12 hover:border-white/20 transition-all duration-300">
            {/* Background glow effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D111A2]/20 rounded-full blur-[100px] group-hover:bg-[#D111A2]/30 transition-all duration-500" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#9D4CDD]/15 rounded-full blur-[80px] group-hover:bg-[#9D4CDD]/25 transition-all duration-500" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
                  <Github size={36} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-light text-white mb-2 group-hover:text-[#D111A2] transition-colors">
                    Explore Our Code
                  </h3>
                  <p className="text-[#A09DB0] text-base md:text-lg">
                    Check out our open source projects on GitHub
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-white group-hover:text-[#D111A2] transition-colors">
                <span className="text-lg font-medium">github.com/QuasarApps</span>
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </motion.a>
      </div>
    </section>
  );
};

export default GitHubCallout;
