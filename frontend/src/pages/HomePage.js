import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import Services from "../components/Services";
import CaseStudies from "../components/CaseStudies";
import About from "../components/About";
import Team from "../components/Team";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <div className="cosmic-bg min-h-screen" data-testid="home-page">
      <Navigation />
      <Hero />
      <Services />
      <CaseStudies />
      <About />
      <Team />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
};

export default HomePage;
