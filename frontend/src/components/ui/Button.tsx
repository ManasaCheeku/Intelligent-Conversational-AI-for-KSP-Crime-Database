import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

const getButtonStyles = (variant: ButtonVariant): string => {
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

// Props that conflict between React's HTML attributes and Framer Motion's props are omitted.
type ConflictingMotionProps = "onAnimationStart" | "onDrag" | "onDragEnd" | "onDragStart" | "onDragEnter" | "onDragLeave" | "onDragOver";

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, ConflictingMotionProps> {
    variant?: ButtonVariant;
    children: React.ReactNode;
    className?: string;
}

export const Button: React.FC<ButtonProps> = (props) => {
    const { variant = 'primary', className, children, ...rest } = props;

    const motionProps: Omit<HTMLMotionProps<"button">, "ref"> = {
        whileHover: { scale: 1.05, y: -1 },
        whileTap: { scale: 0.95, y: 0 },
        transition: { type: 'spring' as const, stiffness: 400, damping: 15 },
    };

    const combinedClassName = `${getButtonStyles(variant)} ${className || ''}`;

    return (
        <motion.button {...motionProps} {...rest} className={combinedClassName}>
            {children}
        </motion.button>
    );
};
