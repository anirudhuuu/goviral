import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { VIDEO_FILTERS } from "@/constants";
import { StreamOrientation } from "@/types";
import {
  Mic,
  MicOff,
  Monitor,
  Settings,
  Smartphone,
  Sparkles,
  Video as VideoIcon,
  VideoOff,
} from "lucide-react";
import React from "react";
import { DeviceSettings } from "./DeviceSettings";
import { VideoFeed } from "./VideoFeed";

import { Switch } from "@/components/ui/switch";
import { VideoQuality } from "@/types";

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
    <div className="w-full h-full bg-[#09090b] flex flex-col animate-in fade-in duration-300 overflow-y-auto">
      <div className="p-4 lg:p-6 flex justify-between items-center shrink-0 bg-[#09090b] sticky top-0 z-10 border-b border-white/5 lg:border-b-0">
        <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-white">
          GoViral Studio
        </h1>
        <TooltipProvider>
          <Tooltip>
            <Sheet>
              <SheetTrigger asChild>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-zinc-500">
                    <Settings size={20} />
                  </Button>
                </TooltipTrigger>
              </SheetTrigger>
              <SheetContent className="bg-[#18181b] border-white/10 text-white p-0 flex flex-col gap-0">
                <SheetHeader className="p-6 border-b border-white/10">
                  <SheetTitle className="text-white">
                    Stream Settings
                  </SheetTitle>
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

      <div className="flex-1 flex flex-col lg:flex-row items-center lg:items-start justify-center p-6 lg:p-8 gap-6 lg:gap-8 w-full max-w-7xl mx-auto pb-8">
        <div className="w-full lg:w-auto order-1 lg:order-2 shrink-0 flex items-center justify-center">
          <div className="relative w-full max-w-[600px] h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center">
            <div
              className={`relative overflow-hidden bg-zinc-900 ring-1 ring-white/10 shadow-2xl rounded-2xl transition-all duration-500 ease-in-out ${
                orientation === "vertical"
                  ? "w-[225px] h-[400px] sm:w-[281.25px] sm:h-[500px] lg:w-[337.5px] lg:h-[600px]"
                  : "w-[400px] h-[225px] sm:w-[500px] sm:h-[281.25px] lg:w-[600px] lg:h-[337.5px]"
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
                          <MicOff size={18} className="text-amber-400" />
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
                          <VideoOff size={18} className="text-amber-400" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {isVideoEnabled ? "Turn Off Camera" : "Turn On Camera"}
                      </p>
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
                          className={currentFilter !== 0 ? "text-red-400" : ""}
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
          </div>
        </div>

        <div className="w-full lg:w-80 order-3 lg:order-3 shrink-0 space-y-6">
          <div className="w-full space-y-3">
            <Label className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">
              Stream Format
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onOrientationChange("vertical")}
                      className={`relative h-32 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
                        orientation === "vertical"
                          ? "bg-blue-500/10 border-2 border-blue-500 shadow-lg shadow-blue-500/20"
                          : "bg-zinc-900/50 border-2 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50"
                      }`}
                    >
                      <Smartphone
                        size={28}
                        className={
                          orientation === "vertical"
                            ? "text-blue-400"
                            : "text-zinc-500"
                        }
                      />
                      <div className="text-center">
                        <div
                          className={`text-sm font-semibold ${
                            orientation === "vertical"
                              ? "text-white"
                              : "text-zinc-400"
                          }`}
                        >
                          Vertical
                        </div>
                        <div className="text-xs text-zinc-500 mt-0.5">
                          9:16 Mobile
                        </div>
                      </div>
                      {orientation === "vertical" && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
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
                      className={`relative h-32 rounded-xl flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
                        orientation === "horizontal"
                          ? "bg-blue-500/10 border-2 border-blue-500 shadow-lg shadow-blue-500/20"
                          : "bg-zinc-900/50 border-2 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50"
                      }`}
                    >
                      <Monitor
                        size={28}
                        className={
                          orientation === "horizontal"
                            ? "text-blue-400"
                            : "text-zinc-500"
                        }
                      />
                      <div className="text-center">
                        <div
                          className={`text-sm font-semibold ${
                            orientation === "horizontal"
                              ? "text-white"
                              : "text-zinc-400"
                          }`}
                        >
                          Horizontal
                        </div>
                        <div className="text-xs text-zinc-500 mt-0.5">
                          16:9 Desktop
                        </div>
                      </div>
                      {orientation === "horizontal" && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
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

          <div className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Your Name
                </Label>
                <Input
                  type="text"
                  value={streamerName}
                  onChange={(e) => onStreamerNameChange(e.target.value)}
                  className="w-full bg-zinc-900/50 border-zinc-800 text-white rounded-xl px-4 py-5 text-base focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-0 focus-visible:ring-offset-zinc-900 placeholder:text-zinc-600"
                  placeholder="Enter your name..."
                  aria-label="Your name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Stream Title
                </Label>
                <Input
                  type="text"
                  value={streamTopic}
                  onChange={(e) => onStreamTopicChange(e.target.value)}
                  className="w-full bg-zinc-900/50 border-zinc-800 text-white rounded-xl px-4 py-5 text-base focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-0 focus-visible:ring-offset-zinc-900 placeholder:text-zinc-600"
                  placeholder="Enter a catchy title..."
                  aria-label="Stream title"
                  required
                />
              </div>
            </div>

            <div className="w-full flex items-center justify-between bg-zinc-900/30 p-5 rounded-xl border border-zinc-800/50">
              <div className="flex flex-col">
                <Label className="text-sm font-semibold text-white mb-1">
                  Practice Mode
                </Label>
                <span className="text-xs text-zinc-500 font-normal">
                  Get real-time speech feedback
                </span>
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
              className="w-full py-6 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-base shadow-lg shadow-red-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse mr-2" />
              <span>Go Live</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
