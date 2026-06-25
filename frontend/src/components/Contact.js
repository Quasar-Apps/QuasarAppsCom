import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/contact`, formData);
      toast.success("Message sent successfully! We'll be in touch soon.");
      setFormData({ name: "", email: "", company: "", message: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section 
      id="contact" 
      className="py-24 md:py-32 px-6 md:px-12 lg:px-24 bg-white/[0.01]"
      data-testid="contact-section"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Info Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs tracking-[0.2em] uppercase text-[#1B93A4] mb-4 block">
              Contact Us
            </span>
            <h2 className="text-4xl sm:text-5xl font-light tracking-tight text-white mb-8">
              Let's build
              <br />
              something <span className="gradient-text">amazing</span>
            </h2>
            <p className="text-[#A09DB0] leading-relaxed text-lg mb-12">
              Have a project in mind? We'd love to hear about it. 
              Drop us a message and let's start a conversation about 
              bringing your ideas to life.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#D111A2]/10 flex items-center justify-center">
                  <Mail size={20} className="text-[#D111A2]" />
                </div>
                <div>
                  <p className="text-sm text-[#68647D]">Email</p>
                  <p className="text-white">admin@quasarapps.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#9D4CDD]/10 flex items-center justify-center">
                  <Phone size={20} className="text-[#9D4CDD]" />
                </div>
                <div>
                  <p className="text-sm text-[#68647D]">Phone</p>
                  <p className="text-white">(602) 456-2610</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#1B93A4]/10 flex items-center justify-center">
                  <MapPin size={20} className="text-[#1B93A4]" />
                </div>
                <div>
                  <p className="text-sm text-[#68647D]">Location</p>
                  <p className="text-white">San Francisco, CA</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form 
              onSubmit={handleSubmit}
              className="contact-glass p-8 md:p-10 relative z-10"
              data-testid="contact-form"
            >
              <div className="space-y-6">
                <div>
                  <label 
                    htmlFor="name" 
                    className="block text-sm text-[#A09DB0] mb-2"
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-glass w-full"
                    placeholder="John Doe"
                    data-testid="contact-name-input"
                  />
                </div>

                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-sm text-[#A09DB0] mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-glass w-full"
                    placeholder="john@example.com"
                    data-testid="contact-email-input"
                  />
                </div>

                <div>
                  <label 
                    htmlFor="company" 
                    className="block text-sm text-[#A09DB0] mb-2"
                  >
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="input-glass w-full"
                    placeholder="Your Company"
                    data-testid="contact-company-input"
                  />
                </div>

                <div>
                  <label 
                    htmlFor="message" 
                    className="block text-sm text-[#A09DB0] mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="input-glass w-full resize-none"
                    placeholder="Tell us about your project..."
                    data-testid="contact-message-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed relative z-20"
                  data-testid="contact-submit-button"
                  onClick={(e) => {
                    if (!loading) {
                      e.currentTarget.form?.requestSubmit();
                    }
                  }}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-[#050211] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
