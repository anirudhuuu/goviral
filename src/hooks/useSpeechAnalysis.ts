import { useState, useEffect, useRef } from "react";

interface SpeechMetrics {
  wordsPerMinute: number;
  fillerWordsCount: number;
  totalWords: number;
  confidenceScore: number;
  pauseCount: number;
}

const FILLER_WORDS = [
  "um",
  "uh",
  "like",
  "you know",
  "basically",
  "actually",
  "literally",
  "so",
  "right",
  "okay",
  "well",
  "hmm",
  "ah",
  "er",
];

export const useSpeechAnalysis = (transcript: string, isActive: boolean) => {
  const [metrics, setMetrics] = useState<SpeechMetrics>({
    wordsPerMinute: 0,
    fillerWordsCount: 0,
    totalWords: 0,
    confidenceScore: 0,
    pauseCount: 0,
  });

  const startTimeRef = useRef<number>(0);
  const wasActiveRef = useRef(false);

  useEffect(() => {
    if (isActive && !wasActiveRef.current) {
      startTimeRef.current = Date.now();
      wasActiveRef.current = true;
    } else if (!isActive && wasActiveRef.current) {
      wasActiveRef.current = false;
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive || !transcript || !wasActiveRef.current) {
      return;
    }

    const updateMetrics = () => {
      const words = transcript
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 0);
      const totalWords = words.length;

      if (totalWords === 0) return;

      const fillerWordsCount = words.reduce((count, word) => {
        const cleanWord = word.replace(/[^\w\s]/g, "");
        return FILLER_WORDS.includes(cleanWord) ? count + 1 : count;
      }, 0);

      const elapsedMinutes = (Date.now() - startTimeRef.current) / 60000;
      const wordsPerMinute =
        elapsedMinutes > 0.016 ? Math.round(totalWords / elapsedMinutes) : 0;

      const fillerRatio = totalWords > 0 ? fillerWordsCount / totalWords : 0;
      const wpmScore =
        wordsPerMinute > 0 ? Math.min(wordsPerMinute / 150, 1) : 0;
      const fillerPenalty = Math.max(0, 1 - fillerRatio * 5);
      const confidenceScore = Math.round(
        (wpmScore * 0.6 + fillerPenalty * 0.4) * 100
      );

      setMetrics({
        wordsPerMinute: Math.min(wordsPerMinute, 300),
        fillerWordsCount,
        totalWords,
        confidenceScore: Math.min(100, Math.max(0, confidenceScore)),
        pauseCount: 0,
      });
    };

    const interval = setInterval(updateMetrics, 1000);
    updateMetrics();

    return () => clearInterval(interval);
  }, [transcript, isActive]);

  return metrics;
};
