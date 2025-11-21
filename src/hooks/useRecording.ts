import { useState, useRef, useCallback, useEffect } from "react";

interface UseRecordingReturn {
  recordedChunks: Blob[];
  downloadUrl: string | null;
  duration: number;
  mediaRecorderRef: React.RefObject<MediaRecorder | null>;
  startRecording: (stream: MediaStream) => void;
  stopRecording: () => void;
  resetRecording: () => void;
}

export const useRecording = (): UseRecordingReturn => {
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback((stream: MediaStream) => {
    chunksRef.current = [];
    setRecordedChunks([]);
    setDownloadUrl(null);
    setDuration(0);
    startTimeRef.current = Date.now();

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setDuration(elapsed);
    }, 1000);

    try {
      const options: MediaRecorderOptions = {
        mimeType: "video/webm;codecs=vp8,opus",
      };

      if (!MediaRecorder.isTypeSupported(options.mimeType || "")) {
        options.mimeType = "video/webm";
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      mediaRecorder.onstop = () => {
        if (chunksRef.current.length > 0) {
          const mimeType = mediaRecorder.mimeType || "video/webm";
          const blob = new Blob(chunksRef.current, { type: mimeType });
          const url = URL.createObjectURL(blob);
          setDownloadUrl(url);
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event);
      };

      mediaRecorder.start(1000);
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const resetRecording = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    chunksRef.current = [];
    setRecordedChunks([]);
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }
    setDownloadUrl(null);
    setDuration(0);
  }, [downloadUrl]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    recordedChunks,
    downloadUrl,
    duration,
    mediaRecorderRef,
    startRecording,
    stopRecording,
    resetRecording,
  };
};
