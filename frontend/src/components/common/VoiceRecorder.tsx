import React, { useState, useEffect, memo } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useSpeechRecognition, type SupportedLanguage } from "../../hooks/useSpeechRecognition";
import { VoiceButton } from "./VoiceButton";
import { VoiceTranscript } from "./VoiceTranscript";

export interface VoiceRecorderProps {
  onTranscriptComplete?: (transcript: string) => void;
  onSend?: (transcript: string) => void;
  autoSend?: boolean;
  initialLanguage?: SupportedLanguage;
  className?: string;
  compact?: boolean;
}

/**
 * Complete Voice-to-Text Dictation Widget.
 * Handles microphone permissions, browser support, recording state, language switching,
 * live transcript editing, and auto-sending to parent handlers.
 */
export const VoiceRecorder: React.FC<VoiceRecorderProps> = memo(function VoiceRecorder({
  onTranscriptComplete,
  onSend,
  autoSend = false,
  initialLanguage = "en-IN",
  className = "",
  compact = false,
}) {
  const [showTranscriptCard, setShowTranscriptCard] = useState<boolean>(false);

  const {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    confidence,
    error,
    language,
    setLanguage,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({
    language: initialLanguage,
    onResult: (resultText, isFinal) => {
      if (isFinal && resultText) {
        if (onTranscriptComplete) onTranscriptComplete(resultText);
        if (autoSend && onSend) onSend(resultText);
      }
    },
  });

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      setShowTranscriptCard(true);
      startListening();
    }
  };

  const handleSendTranscript = (text: string) => {
    if (onSend) onSend(text);
    setShowTranscriptCard(false);
  };

  const handleClear = () => {
    resetTranscript();
  };

  return (
    <div className={`voice-recorder-container ${className}`} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <VoiceButton
          isListening={isListening}
          isSupported={isSupported}
          onClick={toggleListening}
          size={compact ? "sm" : "md"}
        />

        {!isSupported && (
          <span style={{ fontSize: "0.78rem", color: "var(--color-brand-danger, #b52828)" }}>
            Speech recognition not supported in browser
          </span>
        )}
      </div>

      {/* Error alert */}
      {error && (
        <div
          className="alert alert-danger"
          style={{
            padding: "0.5rem 0.75rem",
            fontSize: "0.8rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>

          <button
            type="button"
            onClick={startListening}
            className="text-button"
            style={{ fontSize: "0.78rem", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}
          >
            <RefreshCw size={13} /> Retry
          </button>
        </div>
      )}

      {/* Live transcript widget card */}
      {showTranscriptCard && (transcript || interimTranscript || isListening) && (
        <VoiceTranscript
          transcript={transcript}
          interimTranscript={interimTranscript}
          confidence={confidence}
          isListening={isListening}
          language={language}
          onLanguageChange={setLanguage}
          onClear={handleClear}
          onSend={handleSendTranscript}
        />
      )}
    </div>
  );
});

VoiceRecorder.displayName = "VoiceRecorder";
export default VoiceRecorder;
