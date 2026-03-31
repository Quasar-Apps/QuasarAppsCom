import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
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
              Case Studies
            </h2>
          </div>
          <p className="text-[#A09DB0] max-w-md mt-4 md:mt-0">
            Explore how we've helped companies transform their digital presence 
            and achieve remarkable results.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-2 border-[#D111A2] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map((study, idx) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
              >
                <Link 
                  to={`/case-study/${study.slug}`}
                  className="group block case-study-card case-study-glass glass-shine-hover"
                  data-testid={`case-study-card-${study.slug}`}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src={study.thumbnail} 
                      alt={study.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      {study.services.slice(0, 2).map((service, sIdx) => (
                        <span 
                          key={sIdx}
                          className="text-xs px-3 py-1 rounded-full bg-white/5 text-[#A09DB0]"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-medium text-white mb-2 group-hover:text-[#D111A2] transition-colors">
                          {study.title}
                        </h3>
                        <p className="text-[#68647D] text-sm">
                          {study.client}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#D111A2] transition-all">
                        <ArrowUpRight 
                          size={18} 
                          className="text-[#A09DB0] group-hover:text-white transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CaseStudies;
