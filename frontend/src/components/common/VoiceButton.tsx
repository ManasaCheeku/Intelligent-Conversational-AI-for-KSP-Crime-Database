import React, { memo } from "react";
import { Mic, MicOff } from "lucide-react";

export interface VoiceButtonProps {
  isListening: boolean;
  isSupported?: boolean;
  onClick: () => void;
  title?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Mic toggle button with recording pulse animation.
 * Accessible with ARIA state and keyboard navigation.
 */
export const VoiceButton: React.FC<VoiceButtonProps> = memo(function VoiceButton({
  isListening,
  isSupported = true,
  onClick,
  title = isListening ? "Stop voice dictation" : "Start voice dictation",
  size = "md",
  className = "",
}) {
  const iconSize = size === "sm" ? 16 : size === "lg" ? 22 : 18;

  const buttonClasses = [
    "btn-icon",
    size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "",
    isListening ? "is-recording" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isSupported}
      title={isSupported ? title : "Voice search is not supported in this browser"}
      aria-label={title}
      aria-pressed={isListening}
      className={buttonClasses}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: isListening ? "var(--color-brand-danger, #b52828)" : undefined,
        color: isListening ? "#ffffff" : undefined,
        transition: "all 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {isListening ? (
        <>
          <MicOff size={iconSize} />
          <span
            style={{
              position: "absolute",
              inset: "-3px",
              borderRadius: "50%",
              border: "2px solid var(--color-brand-danger, #b52828)",
              animation: "cx-pulse-ring 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              pointerEvents: "none",
            }}
          />
        </>
      ) : (
        <Mic size={iconSize} />
      )}
    </button>
  );
});

VoiceButton.displayName = "VoiceButton";
export default VoiceButton;
