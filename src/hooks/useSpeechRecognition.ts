import { useState, useEffect, useRef } from "react";
import { SPEECH_CONFIG } from "@/constants";
import { StreamStage } from "@/types";

interface SpeechRecognitionResult {
  isFinal: boolean;
  [key: number]: {
    transcript: string;
  };
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResult[];
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
}

interface UseSpeechRecognitionReturn {
  transcriptBuffer: string;
  recognitionRef: React.RefObject<{ stop: () => void } | null>;
}

export const useSpeechRecognition = (
  stage: StreamStage
): UseSpeechRecognitionReturn => {
  const [transcriptBuffer, setTranscriptBuffer] = useState("");
  const recognitionRef = useRef<{ stop: () => void } | null>(null);
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    isMountedRef.current = true;

    if (stage !== "live") return;
    if (typeof window === "undefined" || !("webkitSpeechRecognition" in window))
      return;

    const SpeechRecognition = (
      window as {
        webkitSpeechRecognition: new () => SpeechRecognitionInstance;
      }
    ).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = SPEECH_CONFIG.LANGUAGE;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      // Only update state if component is still mounted
      if (!isMountedRef.current) return;

      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscriptBuffer((prev) => prev + " " + finalTranscript);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();

    return () => {
      isMountedRef.current = false;
      recognition.stop();
    };
  }, [stage]);

  return { transcriptBuffer, recognitionRef };
};
