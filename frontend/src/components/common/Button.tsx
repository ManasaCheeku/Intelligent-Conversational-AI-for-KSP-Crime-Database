import React, { forwardRef, memo } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "warning"
  | "outline"
  | "ghost"
  | "text";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant mapped to project CSS design tokens */
  variant?: ButtonVariant;
  /** Size tier controlling padding and typography */
  size?: ButtonSize;
  /** Disables interactions and displays a loading spinner */
  loading?: boolean;
  /** Text to render alongside spinner during loading state */
  loadingText?: string;
  /** Icon element placed before button label */
  icon?: React.ReactNode;
  /** Icon element placed after button label */
  rightIcon?: React.ReactNode;
  /** Expands button to 100% width of parent container */
  fullWidth?: boolean;
  /** Formats button as a circular icon-only button */
  iconOnly?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "primary-button",
  secondary: "secondary-button",
  danger: "danger-button",
  success: "btn btn-success",
  warning: "btn btn-warning",
  outline: "btn btn-outline",
  ghost: "btn btn-ghost",
  text: "text-button",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
};

/**
 * Enterprise Button Component for KSP-IntelliCrime-AI.
 * Fully responsive, accessible (WCAG 2.1 AA compliant), and integrated with CSS design tokens.
 */
export const Button = memo(
  forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    {
      variant = "primary",
      size = "md",
      loading = false,
      loadingText,
      icon,
      rightIcon,
      fullWidth = false,
      iconOnly = false,
      children,
      className = "",
      disabled,
      type = "button",
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) {
    const baseVariantClass = VARIANT_CLASSES[variant] || "primary-button";
    const sizeClass = SIZE_CLASSES[size] || "btn-md";
    const fullWidthClass = fullWidth ? "btn-full" : "";
    const iconOnlyClass = iconOnly ? "btn-icon" : "";
    const loadingClass = loading ? "is-loading" : "";

    const combinedClassName = [
      baseVariantClass,
      sizeClass,
      fullWidthClass,
      iconOnlyClass,
      loadingClass,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const isDisabled = disabled || loading;
    const computedAriaLabel =
      ariaLabel || (iconOnly && typeof children === "string" ? children : undefined);

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        aria-label={computedAriaLabel}
        className={combinedClassName}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="spinner"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              style={{ width: "1.1em", height: "1.1em" }}
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                opacity="0.25"
              />
              <path
                d="M12 2a10 10 0 0 1 10 10"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
            {loadingText ? <span>{loadingText}</span> : children && <span>{children}</span>}
          </>
        ) : (
          <>
            {icon && <span aria-hidden="true">{icon}</span>}
            {children && <span>{children}</span>}
            {rightIcon && <span aria-hidden="true">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  })
);

Button.displayName = "Button";
export default Button;