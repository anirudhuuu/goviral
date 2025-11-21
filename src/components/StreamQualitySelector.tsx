import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

export type VideoQuality = "360p" | "720p" | "1080p";

interface QualityConfig {
  width: number;
  height: number;
  bitrate: number;
}

export const QUALITY_PRESETS: Record<VideoQuality, QualityConfig> = {
  "360p": { width: 640, height: 360, bitrate: 1000 },
  "720p": { width: 1280, height: 720, bitrate: 2500 },
  "1080p": { width: 1920, height: 1080, bitrate: 5000 },
};

interface StreamQualitySelectorProps {
  selectedQuality: VideoQuality;
  onQualityChange: (quality: VideoQuality) => void;
  disabled?: boolean;
}

export const StreamQualitySelector: React.FC<StreamQualitySelectorProps> = ({
  selectedQuality,
  onQualityChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-zinc-400">Stream Quality</Label>
      <Select
        value={selectedQuality}
        onValueChange={(v) => onQualityChange(v as VideoQuality)}
        disabled={disabled}
      >
        <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white" disabled={disabled}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
          <SelectItem value="360p">360p (Low)</SelectItem>
          <SelectItem value="720p">720p (HD)</SelectItem>
          <SelectItem value="1080p">1080p (Full HD)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
