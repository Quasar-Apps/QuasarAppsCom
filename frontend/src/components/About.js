import { motion } from "framer-motion";

const stats = [
  { value: "1", label: "Live Product" },
  { value: "2", label: "Co-Founders" },
  { value: "UX", label: "Led Approach" },
  { value: "100%", label: "Committed" },
];

const About = () => {
  return (
    <section 
      id="about" 
      className="py-24 md:py-32 px-6 md:px-12 lg:px-24"
      data-testid="about-section"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs tracking-[0.2em] uppercase text-[#1B93A4] mb-4 block">
              About Us
            </span>
            <h2 className="text-4xl sm:text-5xl font-light tracking-tight text-white mb-8">
              We believe great
              <br />
              <span className="gradient-text">products</span> start with
              <br />
              great experiences
            </h2>
            <p className="text-[#A09DB0] leading-relaxed text-lg mb-6">
              At Quasar Apps, we&apos;re not just developers—we&apos;re experience architects. 
              Our UX-led approach means every pixel, every interaction, and every 
              line of code is crafted with your users in mind.
            </p>
            <p className="text-[#A09DB0] leading-relaxed text-lg">
              We&apos;re building tools we believe in, starting with myCSA.app—a farm 
              management platform made by people who understand the real challenges 
              of running operations. We bring that same user-first philosophy to 
              every project we take on.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, idx) => (
              <div 
                key={stat.label}
                className="stat-glass p-8 text-center"
                data-testid={`stat-${idx}`}
              >
                <div className="text-4xl md:text-5xl font-light text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-[#68647D]">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
