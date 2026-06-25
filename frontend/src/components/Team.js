import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";

const team = [
  {
    name: "Martin Osorio",
    role: "Co-Founder & Tech Lead",
    image: "https://customer-assets.emergentagent.com/job_quantum-ui-3/artifacts/v06tg0kj_20260408_150655.jpg",
    linkedin: "https://www.linkedin.com/in/martinosoriolopez/",
  },
  {
    name: "Christiana Bowen",
    role: "Co-Founder & User Experience Lead",
    image: "https://customer-assets.emergentagent.com/job_quantum-ui-3/artifacts/mrbyv6qp_1765492820351.jpg",
    linkedin: "https://www.linkedin.com/in/uxbowen/",
  },
];

const Team = () => {
  return (
    <section 
      id="team" 
      className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-white/[0.01]"
      data-testid="team-section"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.2em] uppercase text-[#D111A2] mb-4 block">
            Our Team
          </span>
          <h2 className="text-4xl sm:text-5xl font-light tracking-tight text-white mb-4">
            Meet the Founders
          </h2>
          <p className="text-[#A09DB0] max-w-xl mx-auto">
            We're a team of two with complementary skills—technology and user experience—building 
            products we believe in.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 max-w-2xl mx-auto gap-8">
          {team.map((member, idx) => (
            <motion.a
              key={member.name}
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="team-glass-card block cursor-pointer group"
              data-testid={`team-member-${idx}`}
            >
              <div className="relative overflow-hidden">
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050211]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <div className="flex items-center gap-2 text-white">
                      <Linkedin size={18} />
                      <span className="text-sm">View LinkedIn</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-lg font-medium text-white mb-1 group-hover:text-[#D111A2] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-sm text-[#68647D]">
                    {member.role}
                  </p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
