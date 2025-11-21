import React from "react";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
import { Eye, Settings, Mic, MicOff, Sparkles, Heart, Pin } from "lucide-react";
import { CommentItem } from "./CommentItem";
import { ChatInput } from "./ChatInput";
import { DeviceSettings } from "./DeviceSettings";
import { Comment, VideoQuality } from "@/types";

interface LiveStageVerticalProps {
  viewerCount: number;
  duration: number;
  streamTopic: string;
  comments: Comment[];
  messageInput: string;
  showEmojiPicker: boolean;
  isMuted: boolean;
  currentFilter: number;
  devices: MediaDeviceInfo[];
  selectedVideoDeviceId: string;
  selectedAudioDeviceId: string;
  selectedQuality: VideoQuality;
  chatContainerRef: React.RefObject<HTMLDivElement | null>;
  onEndStream: () => void;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onToggleEmojiPicker: () => void;
  onEmojiSelect: (emoji: string) => void;
  onToggleMute: () => void;
  onToggleFilter: () => void;
  onTriggerReaction: (type: string) => void;
  onVideoDeviceChange: (deviceId: string) => void;
  onAudioDeviceChange: (deviceId: string) => void;
  onQualityChange: (quality: VideoQuality) => void;
  onPinComment: (commentId: number) => void;
  onUnpinComment: (commentId: number) => void;
}

export const LiveStageVertical: React.FC<LiveStageVerticalProps> = ({
  viewerCount,
  duration,
  streamTopic,
  comments,
  messageInput,
  showEmojiPicker,
  isMuted,
  currentFilter,
  devices,
  selectedVideoDeviceId,
  selectedAudioDeviceId,
  selectedQuality,
  chatContainerRef,
  onEndStream,
  onMessageChange,
  onSendMessage,
  onToggleEmojiPicker,
  onEmojiSelect,
  onToggleMute,
  onToggleFilter,
  onTriggerReaction,
  onVideoDeviceChange,
  onAudioDeviceChange,
  onQualityChange,
  onPinComment,
  onUnpinComment,
}) => {
  const pinnedComments = comments.filter((c) => c.isPinned);
  const regularComments = comments.filter((c) => !c.isPinned);

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10 pointer-events-none" />

      <div className="absolute top-0 left-0 right-0 p-3 z-30 pointer-events-none">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Badge
              variant="destructive"
              className="bg-red-600 text-white px-2.5 py-1 rounded-md font-semibold text-xs tracking-wider uppercase shadow-lg flex items-center gap-1.5"
            >
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              LIVE
            </Badge>
            <Badge
              variant="outline"
              className="bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md border-white/10 flex items-center text-white"
            >
              <span className="text-xs font-mono font-bold tabular-nums">
                {formatDuration(duration)}
              </span>
            </Badge>
          </div>
          <div className="flex items-center gap-2 pointer-events-auto">
            <Sheet>
              <TooltipProvider>
                <Tooltip>
                  <SheetTrigger asChild>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 bg-black/70 backdrop-blur-md rounded-md border border-white/10 text-zinc-400 hover:text-white hover:bg-black/90"
                      >
                        <Settings size={14} />
                      </Button>
                    </TooltipTrigger>
                  </SheetTrigger>
                  <TooltipContent>
                    <p>Settings</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="outline"
                    className="bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md border-white/10 flex items-center gap-1.5 cursor-default"
                  >
                    <Eye size={12} className="text-zinc-400" />
                    <span className="text-xs font-bold">{viewerCount}</span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Live Viewers</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={onEndStream}
                    variant="destructive"
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs font-semibold shadow-lg h-7"
                  >
                    End
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>End Stream</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <Card className="absolute top-28 left-4 z-20 bg-black/20 backdrop-blur-md border-white/5 rounded-lg p-2.5 max-w-[220px]">
        <div className="flex items-start space-x-2.5">
          <div className="bg-blue-500 p-1 rounded text-white shrink-0 mt-0.5">
            <Pin size={10} />
          </div>
          <p className="text-xs font-medium text-white/90 leading-snug line-clamp-2">
            {streamTopic}
          </p>
        </div>
      </Card>

      <div
        ref={chatContainerRef}
        className="absolute bottom-32 left-0 w-full z-20 px-4 overflow-y-auto pointer-events-auto"
        style={{ height: "35%", maxHeight: "35%" }}
      >
        <div className="flex flex-col min-h-full">
          <div className="flex-1" />
          <AnimatePresence initial={false}>
            {regularComments.map((c) => (
              <CommentItem
                key={c.id}
                comment={c}
                orientation="vertical"
                onPin={onPinComment}
                onUnpin={onUnpinComment}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {pinnedComments.length > 0 && (
        <div className="absolute bottom-32 left-0 right-0 px-4 z-30 pointer-events-auto">
          <AnimatePresence initial={false}>
            {pinnedComments.map((c) => (
              <CommentItem
                key={c.id}
                comment={c}
                orientation="vertical"
                onPin={onPinComment}
                onUnpin={onUnpinComment}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 pt-4 z-30 space-y-3 bg-gradient-to-t from-black/90 to-transparent">
        <ChatInput
          messageInput={messageInput}
          showEmojiPicker={showEmojiPicker}
          orientation="vertical"
          onMessageChange={onMessageChange}
          onSendMessage={onSendMessage}
          onToggleEmojiPicker={onToggleEmojiPicker}
          onEmojiSelect={onEmojiSelect}
        />
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleMute();
                  }}
                  variant="ghost"
                  size="sm"
                  className={`flex-1 hover:bg-zinc-800 border border-zinc-700/50 h-9 ${
                    isMuted
                      ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
                      : "bg-zinc-800/60 text-zinc-300"
                  }`}
                >
                  {isMuted ? (
                    <MicOff size={16} className="mr-1.5" />
                  ) : (
                    <Mic size={16} className="mr-1.5" />
                  )}
                  <span className="text-xs font-medium">
                    {isMuted ? "Unmute" : "Mute"}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isMuted ? "Unmute Microphone" : "Mute Microphone"}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFilter();
                  }}
                  variant="ghost"
                  size="sm"
                  className="flex-1 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/50 h-9"
                >
                  <Sparkles
                    size={16}
                    className={`mr-1.5 ${
                      currentFilter !== 0 ? "text-red-400" : ""
                    }`}
                  />
                  <span className="text-xs font-medium">Filter</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Change Video Filter</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTriggerReaction("love");
                  }}
                  variant="ghost"
                  size="sm"
                  className="flex-1 bg-zinc-800/60 hover:bg-zinc-800 text-red-400 hover:text-red-300 border border-zinc-700/50 h-9"
                >
                  <Heart size={16} fill="currentColor" className="mr-1.5" />
                  <span className="text-xs font-medium">React</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Send Reaction</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </>
  );
};
