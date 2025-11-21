import { useState, useEffect } from "react";

interface UseMediaDevicesReturn {
  devices: MediaDeviceInfo[];
  selectedVideoDeviceId: string;
  selectedAudioDeviceId: string;
  setSelectedVideoDeviceId: (deviceId: string) => void;
  setSelectedAudioDeviceId: (deviceId: string) => void;
}

export const useMediaDevices = (): UseMediaDevicesReturn => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState<string>("");
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState<string>("");

  useEffect(() => {
    const getDevices = async () => {
      try {
        const deviceList = await navigator.mediaDevices.enumerateDevices();
        setDevices(deviceList);

        const videoDevices = deviceList.filter((d) => d.kind === "videoinput");
        const audioDevices = deviceList.filter((d) => d.kind === "audioinput");

        if (videoDevices.length > 0 && !selectedVideoDeviceId) {
          setSelectedVideoDeviceId(videoDevices[0].deviceId);
        }
        if (audioDevices.length > 0 && !selectedAudioDeviceId) {
          setSelectedAudioDeviceId(audioDevices[0].deviceId);
        }
      } catch (error) {
        console.error("Error enumerating devices:", error);
      }
    };

    getDevices();

    navigator.mediaDevices.addEventListener("devicechange", getDevices);
    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", getDevices);
    };
  }, [selectedVideoDeviceId, selectedAudioDeviceId]);

  return {
    devices,
    selectedVideoDeviceId,
    selectedAudioDeviceId,
    setSelectedVideoDeviceId,
    setSelectedAudioDeviceId,
  };
};

