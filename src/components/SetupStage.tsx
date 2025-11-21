import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Settings,
  Smartphone,
  Monitor,
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Sparkles,
} from "lucide-react";
import { VideoFeed } from "./VideoFeed";
import { DeviceSettings } from "./DeviceSettings";
import { StreamOrientation } from "@/types";
import { VIDEO_FILTERS } from "@/constants";

import { VideoQuality } from "@/types";
import { Switch } from "@/components/ui/switch";

interface SetupStageProps {
  orientation: StreamOrientation;
  streamTopic: string;
  streamerName: string;
  isMuted: boolean;
  isVideoEnabled: boolean;
  currentFilter: number;
  currentStream: MediaStream | null;
  devices: MediaDeviceInfo[];
  selectedVideoDeviceId: string;
  selectedAudioDeviceId: string;
  selectedQuality: VideoQuality;
  isPracticeMode: boolean;
  onOrientationChange: (orientation: StreamOrientation) => void;
  onStreamTopicChange: (topic: string) => void;
  onStreamerNameChange: (name: string) => void;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleFilter: () => void;
  onGoLive: () => void;
  onVideoDeviceChange: (deviceId: string) => void;
  onAudioDeviceChange: (deviceId: string) => void;
  onQualityChange: (quality: VideoQuality) => void;
  onPracticeModeChange: (enabled: boolean) => void;
}

export const SetupStage: React.FC<SetupStageProps> = ({
  orientation,
  streamTopic,
  streamerName,
  isMuted,
  isVideoEnabled,
  currentFilter,
  currentStream,
  devices,
  selectedVideoDeviceId,
  selectedAudioDeviceId,
  selectedQuality,
  isPracticeMode,
  onOrientationChange,
  onStreamTopicChange,
  onStreamerNameChange,
  onToggleMute,
  onToggleVideo,
  onToggleFilter,
  onGoLive,
  onVideoDeviceChange,
  onAudioDeviceChange,
  onQualityChange,
  onPracticeModeChange,
}) => {
  return (
    <div className="absolute inset-0 bg-[#09090b] z-50 flex flex-col animate-in fade-in duration-300 overflow-y-auto">
      <div className="p-4 flex justify-between items-center shrink-0 bg-[#09090b] sticky top-0 z-10 border-b border-white/5">
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent">GoViral Studio</h1>
        <TooltipProvider>
          <Tooltip>
            <Sheet>
              <SheetTrigger asChild>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-zinc-500 hover:text-white"
                  >
                    <Settings size={20} />
                  </Button>
                </TooltipTrigger>
              </SheetTrigger>
              <SheetContent className="bg-[#18181b] border-white/10 text-white p-0 flex flex-col gap-0">
                <SheetHeader className="p-6 border-b border-white/10">
                  <SheetTitle className="text-white">Stream Settings</SheetTitle>
                  <SheetDescription className="text-zinc-400">
                    Configure your audio and video devices.
                  </SheetDescription>
                </SheetHeader>
                <DeviceSettings
                  devices={devices}
                  selectedVideoDeviceId={selectedVideoDeviceId}
                  selectedAudioDeviceId={selectedAudioDeviceId}
                  selectedQuality={selectedQuality}
                  onVideoDeviceChange={onVideoDeviceChange}
                  onAudioDeviceChange={onAudioDeviceChange}
                  onQualityChange={onQualityChange}
                />
              </SheetContent>
            </Sheet>
            <TooltipContent>
              <p>Device Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start p-6 space-y-6 w-full max-w-lg mx-auto pb-8">
        <div className="w-full space-y-3">
          <Label className="text-sm font-medium text-zinc-300">Stream Format</Label>
          <div className="grid grid-cols-2 gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onOrientationChange("vertical")}
                    className={`relative h-32 rounded-xl flex flex-col items-center justify-center gap-3 transition-all duration-200 ${
                      orientation === "vertical"
                        ? "bg-gradient-to-br from-red-500/20 to-pink-600/20 border-2 border-red-500 shadow-lg shadow-red-500/20"
                        : "bg-zinc-900 border-2 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80"
                    }`}
                  >
                    <Smartphone size={28} className={orientation === "vertical" ? "text-red-500" : "text-zinc-400"} />
                    <div className="text-center">
                      <div className={`text-sm font-bold ${orientation === "vertical" ? "text-white" : "text-zinc-400"}`}>
                        Vertical
                      </div>
                      <div className="text-xs text-zinc-500">9:16 Mobile</div>
                    </div>
                    {orientation === "vertical" && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Best for mobile viewers & social media</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onOrientationChange("horizontal")}
                    className={`relative h-32 rounded-xl flex flex-col items-center justify-center gap-3 transition-all duration-200 ${
                      orientation === "horizontal"
                        ? "bg-gradient-to-br from-red-500/20 to-pink-600/20 border-2 border-red-500 shadow-lg shadow-red-500/20"
                        : "bg-zinc-900 border-2 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80"
                    }`}
                  >
                    <Monitor size={28} className={orientation === "horizontal" ? "text-red-500" : "text-zinc-400"} />
                    <div className="text-center">
                      <div className={`text-sm font-bold ${orientation === "horizontal" ? "text-white" : "text-zinc-400"}`}>
                        Horizontal
                      </div>
                      <div className="text-xs text-zinc-500">16:9 Desktop</div>
                    </div>
                    {orientation === "horizontal" && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Best for desktop viewers & YouTube</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div
          className={`relative w-full shrink-0 overflow-hidden bg-zinc-900 ring-1 ring-white/10 shadow-2xl rounded-2xl transition-all duration-500 ${
            orientation === "vertical"
              ? "aspect-9/16 max-h-[45vh]"
              : "aspect-video"
          }`}
        >
          <VideoFeed
            stream={currentStream}
            filterClass={VIDEO_FILTERS[currentFilter].class}
          />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={onToggleMute}
                    variant="ghost"
                    size="icon"
                    className="hover:bg-white/10 rounded-full text-white"
                  >
                    {isMuted ? (
                      <MicOff size={18} className="text-red-400" />
                    ) : (
                      <Mic size={18} />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isMuted ? "Unmute" : "Mute"}</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={onToggleVideo}
                    variant="ghost"
                    size="icon"
                    className="hover:bg-white/10 rounded-full text-white"
                  >
                    {isVideoEnabled ? (
                      <VideoIcon size={18} />
                    ) : (
                      <VideoOff size={18} className="text-red-400" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isVideoEnabled ? "Turn Off Camera" : "Turn On Camera"}</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={onToggleFilter}
                    variant="ghost"
                    size="icon"
                    className="hover:bg-white/10 rounded-full text-white"
                  >
                    <Sparkles
                      size={18}
                      className={currentFilter !== 0 ? "text-blue-400" : ""}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Change Filter: {VIDEO_FILTERS[currentFilter].name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="w-full space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-zinc-400 ml-1">
              Your Name
            </Label>
            <Input
              type="text"
              value={streamerName}
              onChange={(e) => onStreamerNameChange(e.target.value)}
              className="w-full bg-zinc-900 border-zinc-800 rounded-xl px-4 py-5 text-sm focus-visible:ring-offset-0 placeholder:text-zinc-600"
              placeholder="Enter your name..."
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium text-zinc-400 ml-1">
              Stream Title
            </Label>
            <Input
              type="text"
              value={streamTopic}
              onChange={(e) => onStreamTopicChange(e.target.value)}
              className="w-full bg-zinc-900 border-zinc-800 rounded-xl px-4 py-5 text-sm focus-visible:ring-offset-0 placeholder:text-zinc-600"
              placeholder="Enter a catchy title..."
            />
          </div>
        </div>

        <div className="w-full flex items-center justify-between bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
          <div className="flex flex-col">
            <Label className="text-sm font-medium text-white">Practice Mode</Label>
            <span className="text-xs text-zinc-500">Get real-time speech feedback</span>
          </div>
          <Switch
            checked={isPracticeMode}
            onCheckedChange={onPracticeModeChange}
          />
        </div>

        <Button
          onClick={onGoLive}
          variant="default"
          size="lg"
          className="w-full py-6 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-lg shadow-lg shadow-red-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="w-3 h-3 bg-white rounded-full animate-pulse mr-2" />
          <span>Go Live</span>
        </Button>
      </div>
    </div>
  );
};

