import { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const navItems = [
  { name: 'Features', href: '#features' },
  { name: 'AI Demo', href: '#demo' },
  { name: 'Technology', href: '#tech' },
  { name: 'About', href: '#about' },
];

export const LandingNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-slate-950/80 border-b border-slate-800/50 backdrop-blur-lg' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <Shield className="h-8 w-8 text-cyan-400" />
            <span className="text-white text-lg font-bold">KSP IntelliCrime AI</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a key={item.name} href={item.href} className="text-slate-300 hover:text-cyan-400 transition-colors duration-200 text-sm font-medium">
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden md:block">
            <Link to="/login" className="btn btn-secondary px-5 py-2 text-sm">Officer Login</Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};