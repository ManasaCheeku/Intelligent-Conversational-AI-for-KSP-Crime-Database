import React from 'react';
import { motion } from 'framer-motion';
import { 
    BrainCircuit, 
    Shield, 
    Search, 
    Eye, 
    Map, 
    Cpu, 
    Users, 
    Languages 
} from 'lucide-react';

const featureList = [
    { icon: BrainCircuit, title: "AI Crime Analytics", description: "Uncover hidden patterns and predict criminal activity with advanced AI." },
    { icon: Cpu, title: "Evidence Intelligence", description: "Automatically process and analyze digital and physical evidence streams." },
    { icon: Eye, title: "Face Recognition", description: "Identify suspects in real-time from CCTV feeds and databases." },
    { icon: Search, title: "Vehicle Detection", description: "Track and identify vehicles involved in criminal activities across the state." },
    { icon: Map, title: "Crime Heat Maps", description: "Visualize crime hotspots and allocate resources more effectively." },
    { icon: Shield, title: "Officer AI Copilot", description: "An AI partner for officers on the field, providing instant data access." },
    { icon: Users, title: "Network Analysis", description: "Map out and understand complex criminal networks and hierarchies." },
    { icon: Languages, title: "Multilingual AI", description: "Break down language barriers with real-time translation and analysis." },
];

const FeatureCard = ({ icon: Icon, title, description, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="glass-card p-8 rounded-2xl h-full transform hover:-translate-y-2 transition-transform duration-300"
    >
        <div className="p-3 inline-block bg-cyan-500/10 rounded-lg border border-cyan-500/20 mb-6">
            <Icon className="text-cyan-400" size={28} />
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-slate-400 text-sm">{description}</p>
    </motion.div>
);

export const Features = () => {
    return (
        <section className="py-24 bg-slate-950">
            <div className="max-w-7xl mx-auto px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6 }} 
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white">Intelligence Modules</h2>
                    <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
                        A suite of powerful AI tools designed for modern policing and criminal investigation.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featureList.map((feature, index) => (
                        <FeatureCard key={feature.title} {...feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};
