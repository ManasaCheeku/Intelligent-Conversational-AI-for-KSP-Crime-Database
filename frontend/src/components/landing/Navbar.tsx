import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

interface NavLinkProps {
    text: string;
}

const NavLink: React.FC<NavLinkProps> = ({ text }) => (
    <a href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
        {text}
    </a>
);

export const Navbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled ? 'py-4 shadow-lg navbar-scrolled' : 'py-6 border-b border-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-3">
                    <Shield className="text-cyan-400" size={24} />
                    <span className="font-bold text-lg text-white">IntelliCrime AI</span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <NavLink text="Features" />
                    <NavLink text="AI Demo" />
                    <NavLink text="Technology" />
                    <NavLink text="About" />
                </div>

                <div className="flex items-center">
                    <Link
                        to="/login"
                        className="px-5 py-2.5 text-sm font-semibold text-white bg-cyan-600 rounded-lg shadow-md shadow-cyan-600/20 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-all"
                    >
                        Officer Login
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
};
