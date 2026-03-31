import { motion } from "framer-motion";
import { Linkedin, Twitter } from "lucide-react";

const team = [
  {
    name: "Alex Rivera",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=srgb&fm=jpg&q=85&w=400",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Sarah Chen",
    role: "Head of Design",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=srgb&fm=jpg&q=85&w=400",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Marcus Webb",
    role: "Lead Engineer",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=srgb&fm=jpg&q=85&w=400",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Elena Vasquez",
    role: "UX Director",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=srgb&fm=jpg&q=85&w=400",
    linkedin: "#",
    twitter: "#",
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
            Meet the Minds
          </h2>
          <p className="text-[#A09DB0] max-w-xl mx-auto">
            A collective of designers, developers, and dreamers united by a 
            passion for creating exceptional digital experiences.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, idx) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group team-member"
              data-testid={`team-member-${idx}`}
            >
              <div className="glass-card overflow-hidden">
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="team-member-overlay flex items-end justify-center pb-6">
                    <div className="flex gap-4">
                      <a 
                        href={member.linkedin}
                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D111A2] transition-colors"
                        aria-label={`${member.name} LinkedIn`}
                      >
                        <Linkedin size={18} className="text-white" />
                      </a>
                      <a 
                        href={member.twitter}
                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#D111A2] transition-colors"
                        aria-label={`${member.name} Twitter`}
                      >
                        <Twitter size={18} className="text-white" />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-lg font-medium text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-[#68647D]">
                    {member.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
