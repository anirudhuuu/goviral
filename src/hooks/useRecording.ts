import { useCallback, useEffect, useRef, useState } from "react";

interface UseRecordingReturn {
  recordedChunks: Blob[];
  downloadUrl: string | null;
  duration: number;
  mimeType: string;
  mediaRecorderRef: React.RefObject<MediaRecorder | null>;
  startRecording: (stream: MediaStream, preserveChunks?: boolean) => void;
  stopRecording: () => void;
  resetRecording: () => void;
}

export const useRecording = (): UseRecordingReturn => {
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [mimeType, setMimeType] = useState<string>("video/mp4");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef<boolean>(true);

  const startRecording = useCallback(
    (stream: MediaStream, preserveChunks = false) => {
      // Only clear chunks if not preserving (i.e., starting fresh recording)
      if (!preserveChunks) {
        chunksRef.current = [];
        setRecordedChunks([]);
        setDownloadUrl(null);
        setDuration(0);
        startTimeRef.current = Date.now();
      } else {
        // If preserving chunks, only initialize startTime if not already set
        if (startTimeRef.current === 0) {
          startTimeRef.current = Date.now();
        }
      }

      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Start the timer interval (only if not already running)
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          if (isMountedRef.current && startTimeRef.current > 0) {
            const elapsed = Math.floor(
              (Date.now() - startTimeRef.current) / 1000
            );
            setDuration(elapsed);
          }
        }, 1000);
      }

      try {
        // Try different mimeTypes in order of preference
        // Prioritize MP4/H.264 for maximum device compatibility
        let mimeType = "";
        const mimeTypes = [
          // MP4 formats (best compatibility across all devices)
          "video/mp4;codecs=avc1.42E01E,mp4a.40.2", // H.264 Baseline + AAC
          "video/mp4;codecs=avc1.4D001E,mp4a.40.2", // H.264 Main + AAC
          "video/mp4;codecs=avc1.64001E,mp4a.40.2", // H.264 High + AAC
          "video/mp4;codecs=h264,opus",
          "video/mp4",
          // WebM formats (good browser support, but limited device support)
          "video/webm;codecs=vp9,opus",
          "video/webm;codecs=vp8,opus",
          "video/webm;codecs=h264,opus",
          "video/webm",
        ];

        for (const type of mimeTypes) {
          if (MediaRecorder.isTypeSupported(type)) {
            mimeType = type;
            break;
          }
        }

        if (!mimeType) {
          // Fallback to default WebM
          mimeType = "video/webm";
        }

        const options: MediaRecorderOptions = {
          mimeType,
        };

        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            chunksRef.current.push(event.data);
            setRecordedChunks((prev) => [...prev, event.data]);
          }
        };

        mediaRecorder.onstop = () => {
          // Process immediately - onstop fires after all data is available
          // Capture final duration
          if (startTimeRef.current > 0) {
            const finalDuration = Math.floor(
              (Date.now() - startTimeRef.current) / 1000
            );
            setDuration(finalDuration);
          }

          if (chunksRef.current.length > 0) {
            let finalMimeType =
              mediaRecorder.mimeType || mimeType || "video/mp4";

            // Normalize mime type for better compatibility
            if (
              finalMimeType.includes("mp4") ||
              finalMimeType.includes("avc1") ||
              finalMimeType.includes("h264")
            ) {
              // Ensure MP4 mime type is correct
              if (!finalMimeType.startsWith("video/mp4")) {
                finalMimeType = "video/mp4";
              }
            } else if (finalMimeType.includes("webm")) {
              // Keep WebM as is
              finalMimeType = finalMimeType;
            } else {
              // Default to MP4 for best compatibility
              finalMimeType = "video/mp4";
            }

            setMimeType(finalMimeType);

            // Create blob with all collected chunks
            const blob = new Blob(chunksRef.current, { type: finalMimeType });

            // Verify blob size is reasonable (at least 1KB)
            if (blob.size > 1024) {
              const url = URL.createObjectURL(blob);
              setDownloadUrl(url);
            } else {
              if (process.env.NODE_ENV === "development") {
                console.warn(
                  "Recording blob too small, may be incomplete:",
                  blob.size
                );
              }
              // Still set it, but warn
              const url = URL.createObjectURL(blob);
              setDownloadUrl(url);
            }
          } else {
            // If no chunks, still try to create a minimal blob or set error state
            if (process.env.NODE_ENV === "development") {
              console.warn("No recording chunks available");
            }
          }
        };

      mediaRecorder.onerror = (event) => {
        if (process.env.NODE_ENV === "development") {
          console.error("MediaRecorder error:", event);
        }
        
        // On error, try to preserve existing chunks by stopping gracefully
        // Request any remaining data before the error state
        try {
          if (mediaRecorder.state === "recording") {
            mediaRecorder.requestData();
          }
        } catch (e) {
          // Ignore errors when requesting data during error state
        }
      };

        // Start with timeslice to ensure regular data chunks
        mediaRecorder.start(1000);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to start recording:", error);
        }
      }
    },
    []
  );

  const stopRecording = useCallback(() => {
    // Capture final duration before clearing interval
    if (intervalRef.current && startTimeRef.current > 0) {
      const finalDuration = Math.floor(
        (Date.now() - startTimeRef.current) / 1000
      );
      setDuration(finalDuration);
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      const recorder = mediaRecorderRef.current;

      // Request final data chunk before stopping to ensure all data is captured
      if (recorder.state === "recording") {
        try {
          recorder.requestData();
        } catch (e) {
          // Some browsers may not support requestData in all states
          if (process.env.NODE_ENV === "development") {
            console.warn("Could not request data:", e);
          }
        }
      }

      // Stop the recorder - onstop will handle blob creation
      try {
        if (recorder.state !== "inactive") {
          recorder.stop();
        }
      } catch (e) {
        if (process.env.NODE_ENV === "development") {
          console.error("Error stopping recorder:", e);
        }
      }
    }
  }, []);

  const resetRecording = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Stop recording if active
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // Ignore errors
      }
    }

    chunksRef.current = [];
    setRecordedChunks([]);

    // Use a ref to access current downloadUrl to avoid dependency
    setDownloadUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
      return null;
    });

    setDuration(0);
    setMimeType("video/mp4");
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;

      // Cleanup on unmount
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Stop recording if still active
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        try {
          mediaRecorderRef.current.stop();
        } catch {
          // Ignore errors during cleanup
        }
      }
    };
  }, []);

  // Separate effect for cleaning up downloadUrl
  useEffect(() => {
    return () => {
      // Revoke blob URL to prevent memory leaks
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  return {
    recordedChunks,
    downloadUrl,
    duration,
    mimeType,
    mediaRecorderRef,
    startRecording,
    stopRecording,
    resetRecording,
  };
};
