import { QUALITY_PRESETS } from "@/components/StreamQualitySelector";
import { StreamOrientation, VideoQuality } from "@/types";
import { useEffect, useRef, useState } from "react";

interface UseMediaStreamProps {
  orientation: StreamOrientation;
  selectedVideoDeviceId: string;
  selectedAudioDeviceId: string;
  isMuted: boolean;
  isVideoEnabled: boolean;
  quality?: VideoQuality;
}

interface UseMediaStreamReturn {
  currentStream: MediaStream | null;
  streamRef: React.RefObject<MediaStream | null>;
  error: string | null;
  isLoading: boolean;
}

export const useMediaStream = ({
  orientation,
  selectedVideoDeviceId,
  selectedAudioDeviceId,
  isMuted,
  isVideoEnabled,
  quality = "720p",
}: UseMediaStreamProps): UseMediaStreamReturn => {
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const streamRef = useRef<MediaStream | null>(null);
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    isMountedRef.current = true;

    const startCamera = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
        }

        const qualityConfig = QUALITY_PRESETS[quality];

        const constraints: MediaStreamConstraints = {
          video: {
            deviceId: selectedVideoDeviceId
              ? { exact: selectedVideoDeviceId }
              : undefined,
            aspectRatio: orientation === "vertical" ? 9 / 16 : 16 / 9,
            width: { ideal: qualityConfig.width },
            height: { ideal: qualityConfig.height },
          },
          audio: {
            deviceId: selectedAudioDeviceId
              ? { exact: selectedAudioDeviceId }
              : undefined,
          },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        // Check if component is still mounted before updating state
        if (!isMountedRef.current) {
          // Clean up stream if component unmounted during async operation
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        setCurrentStream(stream);
        setError(null);
      } catch (err) {
        // Only update state if component is still mounted
        if (!isMountedRef.current) return;

        const error = err as Error;
        let errorMessage = "Failed to access camera or microphone";

        if (
          error.name === "NotAllowedError" ||
          error.name === "PermissionDeniedError"
        ) {
          errorMessage =
            "Camera and microphone access denied. Please grant permissions.";
        } else if (error.name === "NotFoundError") {
          errorMessage = "No camera or microphone found.";
        } else if (error.name === "NotReadableError") {
          errorMessage = "Camera or microphone is already in use.";
        }

        setError(errorMessage);
        setCurrentStream(null);

        if (process.env.NODE_ENV === "development") {
          console.error("Error accessing media devices:", err);
        }
      } finally {
        // Only update state if component is still mounted
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    startCamera();

    // Cleanup function to stop tracks when component unmounts or dependencies change
    return () => {
      isMountedRef.current = false;

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [orientation, selectedVideoDeviceId, selectedAudioDeviceId, quality]);

  useEffect(() => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      const videoTracks = streamRef.current.getVideoTracks();

      if (audioTracks.length > 0) {
        audioTracks.forEach((track) => (track.enabled = !isMuted));
      }

      if (videoTracks.length > 0) {
        videoTracks.forEach((track) => (track.enabled = isVideoEnabled));
      }
    }
  }, [isMuted, isVideoEnabled]);

  return { currentStream, streamRef, error, isLoading };
};
