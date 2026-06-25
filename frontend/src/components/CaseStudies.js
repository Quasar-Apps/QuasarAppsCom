import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CaseStudies = () => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        const response = await axios.get(`${API}/case-studies`);
        setCaseStudies(response.data);
      } catch (error) {
        console.error("Error fetching case studies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCaseStudies();
  }, []);

  return (
    <section 
      id="case-studies" 
      className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-white/[0.01]"
      data-testid="case-studies-section"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-16"
        >
          <div>
            <span className="text-xs tracking-[0.2em] uppercase text-[#9D4CDD] mb-4 block">
              Our Work
            </span>
            <h2 className="text-4xl sm:text-5xl font-light tracking-tight text-white">
              Featured Project
            </h2>
          </div>
          <p className="text-[#A09DB0] max-w-md mt-4 md:mt-0">
            See what we&apos;re building—products designed with real users in mind.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-2 border-[#D111A2] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {caseStudies.map((study, idx) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
              >
                <div 
                  className="case-study-glass glass-shine-hover overflow-hidden"
                  data-testid={`case-study-card-${study.slug}`}
                >
                  <div className="aspect-[16/9] overflow-hidden">
                    <img 
                      src={study.thumbnail} 
                      alt={`${study.title} project thumbnail`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-2 mb-4">
                      {study.services.map((service, sIdx) => (
                        <span 
                          key={sIdx}
                          className="text-xs px-3 py-1 rounded-full bg-white/5 text-[#A09DB0]"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-3xl font-medium text-white mb-3">
                      {study.title}
                    </h3>
                    <p className="text-[#A09DB0] text-lg mb-6 leading-relaxed">
                      {study.short_description}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Link 
                        to={`/case-study/${study.slug}`}
                        className="btn-secondary inline-flex items-center gap-2"
                        data-testid="view-case-study"
                      >
                        <span>View Case Study</span>
                        <ArrowUpRight size={18} />
                      </Link>
                      {study.slug === "mycsa-app" && (
                        <a 
                          href="https://mycsa.app"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary inline-flex items-center gap-2"
                          data-testid="visit-mycsa"
                        >
                          <span>Visit mycsa.app</span>
                          <ExternalLink size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CaseStudies;
