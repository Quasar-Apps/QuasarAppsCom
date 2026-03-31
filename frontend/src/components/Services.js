import { motion } from "framer-motion";
import { Smartphone, Globe, Palette, Database, Zap, Shield } from "lucide-react";

const services = [
  {
    icon: Smartphone,
    title: "Mobile Development",
    description: "Native and cross-platform apps for iOS and Android that users love to use.",
    color: "#D111A2",
  },
  {
    icon: Globe,
    title: "Web Applications",
    description: "Scalable, performant web apps built with modern technologies and best practices.",
    color: "#9D4CDD",
  },
  {
    icon: Palette,
    title: "UX/UI Design",
    description: "Human-centered design that creates intuitive, delightful user experiences.",
    color: "#1B93A4",
  },
  {
    icon: Database,
    title: "Backend Systems",
    description: "Robust architecture and APIs that power your applications reliably.",
    color: "#D111A2",
  },
  {
    icon: Zap,
    title: "Performance",
    description: "Optimization and speed improvements that keep users engaged.",
    color: "#9D4CDD",
  },
  {
    icon: Shield,
    title: "Security",
    description: "Enterprise-grade security practices to protect your data and users.",
    color: "#1B93A4",
  },
];

const Services = () => {
  return (
    <section 
      id="services" 
      className="py-24 md:py-32 px-6 md:px-12 lg:px-24"
      data-testid="services-section"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-xs tracking-[0.2em] uppercase text-[#D111A2] mb-4 block">
            What We Do
          </span>
          <h2 className="text-4xl sm:text-5xl font-light tracking-tight text-white">
            Services
          </h2>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`glass-card service-card p-8 ${
                idx === 0 ? "lg:col-span-2 lg:row-span-1" : ""
              } ${idx === 3 ? "lg:col-span-2" : ""}`}
              data-testid={`service-${idx}`}
            >
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                style={{ backgroundColor: `${service.color}20` }}
              >
                <service.icon 
                  size={28} 
                  style={{ color: service.color }}
                />
              </div>
              <h3 className="text-xl md:text-2xl font-medium text-white mb-3">
                {service.title}
              </h3>
              <p className="text-[#A09DB0] leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
