import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Clock, Calendar, Building2, Layers, ExternalLink } from "lucide-react";
import axios from "axios";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CaseStudyPage = () => {
  const { slug } = useParams();
  const [caseStudy, setCaseStudy] = useState(null);
  const [allStudies, setAllStudies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studyRes, allRes] = await Promise.all([
          axios.get(`${API}/case-studies/${slug}`),
          axios.get(`${API}/case-studies`)
        ]);
        setCaseStudy(studyRes.data);
        setAllStudies(allRes.data);
      } catch (error) {
        console.error("Error fetching case study:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen cosmic-bg flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#D111A2] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!caseStudy) {
    return (
      <div className="min-h-screen cosmic-bg">
        <Navigation />
        <div className="pt-32 px-6 text-center">
          <h1 className="text-4xl font-light text-white mb-4">Case Study Not Found</h1>
          <Link to="/" className="btn-primary inline-block">Go Home</Link>
        </div>
      </div>
    );
  }

  const currentIndex = allStudies.findIndex(s => s.slug === slug);
  const prevStudy = allStudies[currentIndex - 1];
  const nextStudy = allStudies[currentIndex + 1];

  return (
    <div className="min-h-screen cosmic-bg page-transition" data-testid="case-study-page">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-end">
        <div className="absolute inset-0">
          <img 
            src={caseStudy.hero_image} 
            alt={caseStudy.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-gradient" />
        </div>
        
        <div className="relative z-10 w-full px-6 md:px-12 lg:px-24 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link 
              to="/#case-studies" 
              className="inline-flex items-center gap-2 text-[#A09DB0] hover:text-white mb-8 transition-colors"
              data-testid="back-to-cases"
            >
              <ArrowLeft size={20} />
              <span>Back to Case Studies</span>
            </Link>
            
            <div className="flex flex-wrap gap-3 mb-6">
              {caseStudy.services.map((service, idx) => (
                <span 
                  key={idx}
                  className="px-4 py-1.5 rounded-full bg-white/10 text-sm text-[#A09DB0]"
                >
                  {service}
                </span>
              ))}
            </div>
            
            <h1 
              className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tighter text-white mb-6"
              data-testid="case-study-title"
            >
              {caseStudy.title}
            </h1>
            
            <p className="text-xl text-[#A09DB0] max-w-2xl mb-8">
              {caseStudy.short_description}
            </p>
            
            {caseStudy.slug === 'mycsa-app' && (
              <a 
                href="https://mycsa.app"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2"
                data-testid="visit-live-site"
              >
                <span>Visit Live Site</span>
                <ExternalLink size={18} />
              </a>
            )}
          </motion.div>
        </div>
      </section>

      {/* Meta Info */}
      <section className="py-16 px-6 md:px-12 lg:px-24 border-b border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 text-[#D111A2] mb-2">
              <Building2 size={20} />
              <span className="text-xs tracking-[0.2em] uppercase">Client</span>
            </div>
            <p className="text-white text-lg">{caseStudy.client}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 text-[#9D4CDD] mb-2">
              <Layers size={20} />
              <span className="text-xs tracking-[0.2em] uppercase">Industry</span>
            </div>
            <p className="text-white text-lg">{caseStudy.industry}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 text-[#1B93A4] mb-2">
              <Clock size={20} />
              <span className="text-xs tracking-[0.2em] uppercase">Duration</span>
            </div>
            <p className="text-white text-lg">{caseStudy.duration}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 text-[#D111A2] mb-2">
              <Calendar size={20} />
              <span className="text-xs tracking-[0.2em] uppercase">Year</span>
            </div>
            <p className="text-white text-lg">{caseStudy.year}</p>
          </motion.div>
        </div>
      </section>

      {/* Challenge & Solution */}
      <section className="py-24 px-6 md:px-12 lg:px-24">
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs tracking-[0.2em] uppercase text-[#D111A2] mb-4 block">
              The Challenge
            </span>
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white mb-6">
              Understanding the Problem
            </h2>
            <p className="text-[#A09DB0] leading-relaxed text-lg">
              {caseStudy.challenge}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs tracking-[0.2em] uppercase text-[#9D4CDD] mb-4 block">
              Our Solution
            </span>
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white mb-6">
              Crafting the Experience
            </h2>
            <p className="text-[#A09DB0] leading-relaxed text-lg">
              {caseStudy.solution}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Results */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-white/[0.02]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs tracking-[0.2em] uppercase text-[#1B93A4] mb-4 block">
            Impact
          </span>
          <h2 className="text-4xl sm:text-5xl font-light tracking-tight text-white">
            The Results
          </h2>
        </motion.div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {caseStudy.results.map((result, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-8 text-center"
              data-testid={`result-${idx}`}
            >
              <p className="text-white text-lg">{result}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Technologies */}
      <section className="py-24 px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="text-xs tracking-[0.2em] uppercase text-[#D111A2] mb-4 block">
            Tech Stack
          </span>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white">
            Technologies Used
          </h2>
        </motion.div>
        
        <div className="flex flex-wrap gap-4">
          {caseStudy.technologies.map((tech, idx) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-default"
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      {caseStudy.testimonial && (
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-white/[0.02]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="relative">
              <span className="text-8xl text-[#D111A2]/20 font-serif absolute -top-8 left-0">"</span>
              <blockquote className="text-2xl sm:text-3xl font-light text-white leading-relaxed mb-8 relative z-10">
                {caseStudy.testimonial}
              </blockquote>
            </div>
            <div>
              <p className="text-white font-medium">{caseStudy.testimonial_author}</p>
              <p className="text-[#A09DB0]">{caseStudy.testimonial_role}</p>
            </div>
          </motion.div>
        </section>
      )}

      {/* Navigation to Other Case Studies */}
      <section className="py-16 px-6 md:px-12 lg:px-24 border-t border-white/10">
        <div className="flex justify-between items-center">
          {prevStudy ? (
            <Link 
              to={`/case-study/${prevStudy.slug}`}
              className="group flex items-center gap-4"
              data-testid="prev-case-study"
            >
              <ArrowLeft size={24} className="text-[#A09DB0] group-hover:text-white transition-colors" />
              <div>
                <span className="text-xs text-[#68647D] block mb-1">Previous</span>
                <span className="text-white group-hover:text-[#D111A2] transition-colors">
                  {prevStudy.title}
                </span>
              </div>
            </Link>
          ) : <div />}
          
          {nextStudy ? (
            <Link 
              to={`/case-study/${nextStudy.slug}`}
              className="group flex items-center gap-4 text-right"
              data-testid="next-case-study"
            >
              <div>
                <span className="text-xs text-[#68647D] block mb-1">Next</span>
                <span className="text-white group-hover:text-[#D111A2] transition-colors">
                  {nextStudy.title}
                </span>
              </div>
              <ArrowRight size={24} className="text-[#A09DB0] group-hover:text-white transition-colors" />
            </Link>
          ) : <div />}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CaseStudyPage;
