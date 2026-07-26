import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

// A component for the faux "dashboard" illustration
const CinematicIllustration = () => {
    // Using a placeholder image with specific text to convey the idea
    const imageUrl = "https://placehold.co/1200x800/050a19/1e293b.png?text=Futuristic+Police+Command+Center+UI";

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="relative w-full h-full aspect-[4/3] max-w-3xl"
        >
            <div 
                className="w-full h-full rounded-2xl bg-cover bg-center shadow-2xl shadow-cyan-500/10"
                style={{ backgroundImage: `url(${imageUrl})` }}
            >
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />
                 <div className="absolute inset-0 rounded-2xl border-2 border-slate-700/50" />
            </div>
            {/* Adding some floating UI elements to make it look more dynamic */}
            <motion.div 
                initial={{ y: 0 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute top-1/4 -left-12 p-3 rounded-lg glass-card text-center"
            >
                <p className="text-xs text-red-400 font-bold">ALERT</p>
                <p className="text-sm text-white">High-Risk Zone</p>
            </motion.div>
             <motion.div 
                initial={{ y: 0 }}
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                className="absolute bottom-1/4 -right-16 p-4 rounded-lg glass-card"
            >
                 <p className="text-xs text-cyan-400">STATUS: <span className="text-green-400">NOMINAL</span></p>
            </motion.div>
        </motion.div>
    );
};

export const Hero = () => {
  return (
    <section className="relative w-full h-screen flex items-center justify-center bg-slate-950 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 z-0">
             <div className="absolute top-0 left-0 w-1/3 h-2/3 bg-cyan-900/40 blur-3xl opacity-30" />
             <div className="absolute bottom-0 right-0 w-1/3 h-2/3 bg-indigo-900/40 blur-3xl opacity-30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-16 px-8">
            {/* Left Side: Content */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white">
                    AI Crime Intelligence <span className="text-cyan-400">Platform</span>
                </h1>
                <p className="mt-6 text-lg text-slate-300 max-w-lg">
                    AI-powered investigation platform for Karnataka State Police, enabling faster response and predictive insights.
                </p>
                <div className="mt-10 flex items-center gap-4">
                    <Button to="/login" variant="primary">
                        <span>Secure Login</span>
                        <ArrowRight size={18} />
                    </Button>
                    <Button variant="secondary">
                        <PlayCircle size={18} />
                        <span>Watch Demo</span>
                    </Button>
                </div>
            </motion.div>

            {/* Right Side: Illustration */}
            <div className="hidden md:flex items-center justify-center">
                <CinematicIllustration />
            </div>
        </div>
    </section>
  );
};
