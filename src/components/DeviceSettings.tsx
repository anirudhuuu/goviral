import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { StreamQualitySelector, VideoQuality } from "./StreamQualitySelector";

interface DeviceSettingsProps {
  devices: MediaDeviceInfo[];
  selectedVideoDeviceId: string;
  selectedAudioDeviceId: string;
  selectedQuality: VideoQuality;
  onVideoDeviceChange: (deviceId: string) => void;
  onAudioDeviceChange: (deviceId: string) => void;
  onQualityChange: (quality: VideoQuality) => void;
  disabled?: boolean;
}

export const DeviceSettings: React.FC<DeviceSettingsProps> = ({
  devices,
  selectedVideoDeviceId,
  selectedAudioDeviceId,
  selectedQuality,
  onVideoDeviceChange,
  onAudioDeviceChange,
  onQualityChange,
  disabled = false,
}) => {
  const videoDevices = devices.filter((d) => d.kind === "videoinput");
  const audioDevices = devices.filter((d) => d.kind === "audioinput");

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <Label className="text-zinc-400">Camera</Label>
        <Select
          value={selectedVideoDeviceId}
          onValueChange={onVideoDeviceChange}
          disabled={disabled}
        >
          <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white" disabled={disabled}>
            <SelectValue placeholder="Select Camera" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
            {videoDevices.map((device) => (
              <SelectItem key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${device.deviceId.slice(0, 5)}...`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-zinc-400">Microphone</Label>
        <Select
          value={selectedAudioDeviceId}
          onValueChange={onAudioDeviceChange}
          disabled={disabled}
        >
          <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white" disabled={disabled}>
            <SelectValue placeholder="Select Microphone" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
            {audioDevices.map((device) => (
              <SelectItem key={device.deviceId} value={device.deviceId}>
                {device.label || `Microphone ${device.deviceId.slice(0, 5)}...`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <StreamQualitySelector
        selectedQuality={selectedQuality}
        onQualityChange={onQualityChange}
        disabled={disabled}
      />
    </div>
  );
};
