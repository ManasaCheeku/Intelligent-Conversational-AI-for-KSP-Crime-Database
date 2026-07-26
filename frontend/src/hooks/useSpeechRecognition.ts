import { useState, useEffect, useRef, useCallback } from "react";

// Web Speech API Type Declarations for TypeScript compatibility
export interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

export interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onend: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onerror: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionEvent) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export type SupportedLanguage = "en-IN" | "kn-IN" | "hi-IN";

export interface UseSpeechRecognitionOptions {
  language?: SupportedLanguage;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (transcript: string, isFinal: boolean, confidence: number) => void;
  onError?: (error: string) => void;
}

export interface UseSpeechRecognitionReturn {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  confidence: number;
  error: string | null;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

/**
 * Reusable Web Speech API Hook for KSP IntelliCrime AI.
 * Supports English (en-IN), Kannada (kn-IN), and Hindi (hi-IN) dictation.
 */
export function useSpeechRecognition({
  language: initialLanguage = "en-IN",
  continuous = true,
  interimResults = true,
  onResult,
  onError,
}: UseSpeechRecognitionOptions = {}): UseSpeechRecognitionReturn {
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [interimTranscript, setInterimTranscript] = useState<string>("");
  const [confidence, setConfidence] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<SupportedLanguage>(initialLanguage);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setIsSupported(false);
      setError("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
    }
  }, []);

  const startListening = useCallback(() => {
    setError(null);
    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setIsSupported(false);
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognitionClass();
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = language;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalStr = "";
        let interimStr = "";
        let latestConfidence = 0;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const transcriptText = result[0].transcript;
          if (result[0].confidence) {
            latestConfidence = Math.round(result[0].confidence * 100);
          }

          if (result.isFinal) {
            finalStr += transcriptText;
          } else {
            interimStr += transcriptText;
          }
        }

        if (finalStr) {
          setTranscript((prev) => (prev ? `${prev} ${finalStr}`.trim() : finalStr.trim()));
          if (latestConfidence > 0) setConfidence(latestConfidence);
          if (onResult) onResult(finalStr.trim(), true, latestConfidence);
        }

        setInterimTranscript(interimStr);
        if (interimStr && onResult) {
          onResult(interimStr, false, latestConfidence);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        let errorMsg = "An error occurred during speech recognition.";
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          errorMsg = "Microphone access denied. Please allow microphone permissions in your browser settings.";
        } else if (event.error === "no-speech") {
          errorMsg = "No speech detected. Please speak clearly into your microphone.";
        } else if (event.error === "network") {
          errorMsg = "Network connection error during speech recognition.";
        }

        setError(errorMsg);
        setIsListening(false);
        if (onError) onError(errorMsg);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript("");
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : "Could not start speech recognition.";
      setError(errMessage);
      setIsListening(false);
      if (onError) onError(errMessage);
    }
  }, [continuous, interimResults, language, onResult, onError]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
    setConfidence(0);
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  return {
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
  };
}
