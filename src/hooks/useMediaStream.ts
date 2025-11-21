import { useState, useEffect, useRef } from "react";
import { StreamOrientation, VideoQuality } from "@/types";
import { QUALITY_PRESETS } from "@/components/StreamQualitySelector";

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
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const startCamera = async () => {
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
        streamRef.current = stream;
        setCurrentStream(stream);
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    };

    startCamera();
  }, [orientation, selectedVideoDeviceId, selectedAudioDeviceId, quality]);

  useEffect(() => {
    if (streamRef.current) {
      streamRef.current
        .getAudioTracks()
        .forEach((track) => (track.enabled = !isMuted));
      streamRef.current
        .getVideoTracks()
        .forEach((track) => (track.enabled = isVideoEnabled));
    }
  }, [isMuted, isVideoEnabled]);

  return { currentStream, streamRef };
};

