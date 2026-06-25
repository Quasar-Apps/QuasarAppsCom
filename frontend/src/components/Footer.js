import { Link } from "react-router-dom";
import { Github, Linkedin } from "lucide-react";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_3cec2ff5-d333-4729-964f-f800e226e677/artifacts/3x01ffer_ChatGPT%20Image%20Mar%2031%2C%202026%2C%2005_44_24%20PM.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleNavClick = (e, href) => {
    if (href.startsWith("/#")) {
      e.preventDefault();
      const targetId = href.replace("/#", "");
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer 
      className="border-t border-white/10 py-16 px-6 md:px-12 lg:px-24"
      data-testid="footer"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <img 
                src={LOGO_URL} 
                alt="Quasar Apps" 
                className="h-12 w-auto glow-magenta"
              />
            </Link>
            <p className="text-[#A09DB0] leading-relaxed max-w-md mb-6">
              We craft digital experiences that transcend. A UX-led web and 
              mobile development studio building tools we believe in.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://github.com/QuasarApps" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D111A2] transition-colors"
                aria-label="GitHub"
              >
                <Github size={18} className="text-white" />
              </a>
              <a 
                href="https://www.linkedin.com/in/martinosoriolopez/" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D111A2] transition-colors"
                aria-label="Martin's LinkedIn"
              >
                <Linkedin size={18} className="text-white" />
              </a>
              <a 
                href="https://www.linkedin.com/in/uxbowen/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D111A2] transition-colors"
                aria-label="Christiana's LinkedIn"
              >
                <Linkedin size={18} className="text-white" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-medium mb-6">Company</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="/#about"
                  onClick={(e) => handleNavClick(e, "/#about")}
                  className="text-[#A09DB0] hover:text-white transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a 
                  href="/#services"
                  onClick={(e) => handleNavClick(e, "/#services")}
                  className="text-[#A09DB0] hover:text-white transition-colors"
                >
                  Services
                </a>
              </li>
              <li>
                <a 
                  href="/#case-studies"
                  onClick={(e) => handleNavClick(e, "/#case-studies")}
                  className="text-[#A09DB0] hover:text-white transition-colors"
                >
                  Case Studies
                </a>
              </li>
              <li>
                <a 
                  href="/#team"
                  onClick={(e) => handleNavClick(e, "/#team")}
                  className="text-[#A09DB0] hover:text-white transition-colors"
                >
                  Team
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6">Connect</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="/#contact"
                  onClick={(e) => handleNavClick(e, "/#contact")}
                  className="text-[#A09DB0] hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a 
                  href="mailto:hello@quasarapps.com"
                  className="text-[#A09DB0] hover:text-white transition-colors"
                >
                  hello@quasarapps.com
                </a>
              </li>
              <li>
                <a 
                  href="tel:+15551234567"
                  className="text-[#A09DB0] hover:text-white transition-colors"
                >
                  +1 (555) 123-4567
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#68647D] text-sm">
            © {currentYear} Quasar Apps. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-[#68647D] hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-[#68647D] hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
