import React, { useState, useEffect, memo } from "react";
import { Copy, Check, RotateCcw, Trash2, Send, Languages, Sparkles } from "lucide-react";
import type { SupportedLanguage } from "../../hooks/useSpeechRecognition";

export interface VoiceTranscriptProps {
  transcript: string;
  interimTranscript?: string;
  confidence?: number;
  isListening: boolean;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onClear: () => void;
  onSend?: (text: string) => void;
  onTranscriptChange?: (text: string) => void;
  className?: string;
}

/**
 * Accessible Live Transcript viewer with editing, language selection, copy, and send actions.
 */
export const VoiceTranscript: React.FC<VoiceTranscriptProps> = memo(function VoiceTranscript({
  transcript,
  interimTranscript = "",
  confidence = 0,
  isListening,
  language,
  onLanguageChange,
  onClear,
  onSend,
  onTranscriptChange,
  className = "",
}) {
  const [editableText, setEditableText] = useState<string>(transcript);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    setEditableText(transcript);
  }, [transcript]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setEditableText(newText);
    if (onTranscriptChange) onTranscriptChange(newText);
  };

  const handleCopy = async () => {
    const textToCopy = editableText || transcript;
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Copy failed");
    }
  };

  const handleSend = () => {
    const textToSend = editableText || transcript;
    if (textToSend.trim() && onSend) {
      onSend(textToSend.trim());
    }
  };

  return (
    <div
      className={`card p-4 ${className}`}
      style={{
        background: "var(--color-bg-elevated, #16232e)",
        border: "1px solid var(--color-border-subtle, rgba(255, 255, 255, 0.12))",
        borderRadius: "var(--border-radius-md, 12px)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.75rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Sparkles size={16} style={{ color: "var(--color-brand-ai, #6366f1)" }} />
          <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--color-text-light, #eaf4ff)" }}>
            Voice Dictation
          </span>

          {isListening && (
            <span
              className="badge badge-live"
              style={{
                fontSize: "0.7rem",
                padding: "0.15rem 0.45rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              Listening...
            </span>
          )}

          {confidence > 0 && (
            <span
              style={{
                fontSize: "0.72rem",
                color: "var(--color-text-secondary-dark, #668096)",
                marginLeft: "0.4rem",
              }}
            >
              Confidence: {confidence}%
            </span>
          )}
        </div>

        {/* Language selector */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Languages size={15} style={{ color: "var(--color-text-secondary-dark, #668096)" }} />
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
            aria-label="Select dictation language"
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              color: "var(--color-text-light, #eaf4ff)",
              border: "1px solid var(--color-border-subtle, rgba(255,255,255,0.15))",
              borderRadius: "6px",
              padding: "0.2rem 0.4rem",
              fontSize: "0.78rem",
            }}
          >
            <option value="en-IN">English (India)</option>
            <option value="kn-IN">ಕನ್ನಡ (Kannada)</option>
            <option value="hi-IN">हिन्दी (Hindi)</option>
          </select>
        </div>
      </div>

      {/* Transcript Textarea */}
      <div style={{ position: "relative", marginBottom: "0.75rem" }}>
        <textarea
          value={editableText}
          onChange={handleTextChange}
          placeholder={isListening ? "Listening... Speak into your microphone" : "Dictated text will appear here. You can also edit it manually."}
          rows={3}
          aria-label="Voice transcript editor"
          style={{
            width: "100%",
            background: "rgba(0, 0, 0, 0.25)",
            color: "var(--color-text-light, #eaf4ff)",
            border: "1px solid var(--color-border-subtle, rgba(255, 255, 255, 0.12))",
            borderRadius: "8px",
            padding: "0.6rem",
            fontSize: "0.88rem",
            fontFamily: "inherit",
            resize: "vertical",
          }}
        />

        {interimTranscript && (
          <div
            style={{
              fontSize: "0.82rem",
              fontStyle: "italic",
              color: "var(--color-brand-info, #086ca5)",
              marginTop: "0.2rem",
            }}
          >
            {interimTranscript}...
          </div>
        )}
      </div>

      {/* Action toolbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <div style={{ display: "flex", gap: "0.4rem" }}>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!editableText && !transcript}
            className="secondary-button btn-sm"
            style={{ padding: "0.35rem 0.6rem", fontSize: "0.78rem" }}
            title="Copy transcript"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>

          <button
            type="button"
            onClick={onClear}
            disabled={!editableText && !transcript}
            className="secondary-button btn-sm"
            style={{ padding: "0.35rem 0.6rem", fontSize: "0.78rem" }}
            title="Clear transcript"
          >
            <Trash2 size={14} />
            <span>Clear</span>
          </button>
        </div>

        {onSend && (
          <button
            type="button"
            onClick={handleSend}
            disabled={!editableText && !transcript}
            className="primary-button btn-sm"
            style={{ padding: "0.35rem 0.8rem", fontSize: "0.78rem" }}
          >
            <Send size={14} />
            <span>Use Transcript</span>
          </button>
        )}
      </div>
    </div>
  );
});

VoiceTranscript.displayName = "VoiceTranscript";
export default VoiceTranscript;
