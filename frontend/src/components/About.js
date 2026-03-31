import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";

const stats = [
  { value: "50+", label: "Projects Delivered" },
  { value: "8+", label: "Years Experience" },
  { value: "30+", label: "Happy Clients" },
  { value: "15", label: "Team Members" },
];

const clients = [
  { name: "Nike", logo: "https://images.unsplash.com/photo-1674978037981-fef8cbf2b3a2?crop=entropy&cs=srgb&fm=jpg&q=85&w=200" },
  { name: "Apple Sports", logo: "https://images.unsplash.com/photo-1760037028485-d00dd2b8f6f0?crop=entropy&cs=srgb&fm=jpg&q=85&w=200" },
  { name: "Leut", logo: "https://images.unsplash.com/photo-1769984867572-10dea95bd4f1?crop=entropy&cs=srgb&fm=jpg&q=85&w=200" },
];

const About = () => {
  return (
    <section 
      id="about" 
      className="py-24 md:py-32 px-6 md:px-12 lg:px-24"
      data-testid="about-section"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
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
              At Quasar Apps, we're not just developers—we're experience architects. 
              Our UX-led approach means every pixel, every interaction, and every 
              line of code is crafted with your users in mind.
            </p>
            <p className="text-[#A09DB0] leading-relaxed text-lg">
              Founded in 2016, we've grown from a small team of passionate 
              designers and developers into a full-service digital studio, 
              working with startups and enterprises alike to bring their 
              visions to life.
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

        {/* Client Logos Marquee */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border-t border-white/10 pt-16"
        >
          <p className="text-center text-sm text-[#68647D] mb-10 tracking-wider uppercase">
            Trusted by innovative companies
          </p>
          
          <div className="marquee-container">
            <Marquee 
              speed={40} 
              gradient={false}
              pauseOnHover
            >
              {[...clients, ...clients, ...clients].map((client, idx) => (
                <div 
                  key={idx}
                  className="mx-12 opacity-40 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                >
                  <img 
                    src={client.logo} 
                    alt={client.name}
                    className="h-12 w-auto object-contain"
                  />
                </div>
              ))}
            </Marquee>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
