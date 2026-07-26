import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const getButtonStyles = (variant) => {
    const baseStyles = 'inline-flex items-center justify-center px-6 py-3 text-sm font-bold tracking-wide rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950';

    switch (variant) {
        case 'secondary':
            return `${baseStyles} text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 focus:ring-cyan-400`;
        case 'ghost':
            return `${baseStyles} text-slate-300 hover:bg-slate-800 hover:text-white`;
        case 'primary':
        default:
            return `${baseStyles} text-white bg-cyan-600 shadow-lg shadow-cyan-600/20 hover:bg-cyan-700 hover:shadow-cyan-600/30 focus:ring-cyan-500`;
    }
};

export const Button = ({ variant = 'primary', children, to, className, ...props }) => {
    const motionProps = {
        whileHover: { scale: 1.05, y: -1 },
        whileTap: { scale: 0.95, y: 0 },
        transition: { type: 'spring', stiffness: 400, damping: 15 },
    };

    const combinedClassName = `${getButtonStyles(variant)} ${className || ''}`;

    if (to) {
        return (
            <motion.div {...motionProps}>
                <Link to={to} className={combinedClassName} {...props}>
                    {children}
                </Link>
            </motion.div>
        );
    }

    return (
        <motion.button {...motionProps} className={combinedClassName} {...props}>
            {children}
        </motion.button>
    );
};
