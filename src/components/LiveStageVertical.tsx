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
import {
  User,
  X,
  Settings,
  Mic,
  MicOff,
  Sparkles,
  Heart,
  Pin,
} from "lucide-react";
import { CommentItem } from "./CommentItem";
import { ChatInput } from "./ChatInput";
import { DeviceSettings } from "./DeviceSettings";
import { Comment, VideoQuality } from "@/types";

interface LiveStageVerticalProps {
  viewerCount: number;
  duration: number;
  streamTopic: string;
  streamerName: string;
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
  streamerName,
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
      <div className="absolute top-0 inset-x-0 h-32 bg-linear-to-b from-black/80 via-black/40 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-64 bg-linear-to-t from-black/90 via-black/50 to-transparent z-10 pointer-events-none" />

      <div className="absolute top-0 left-0 right-0 p-4 pt-12 z-30 flex justify-between items-start">
        <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-xl rounded-full p-1 pr-4 border border-white/5">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-zinc-700 to-zinc-600 flex items-center justify-center">
            <User size={14} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold leading-none text-zinc-300 mb-0.5">
              {streamerName}
            </span>
            <span className="text-[10px] font-bold leading-none text-white">
              LIVE
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge
            variant="outline"
            className="px-2.5 py-1 bg-black/30 backdrop-blur-md border-white/10 rounded-md flex items-center text-white"
          >
            <span className="text-xs font-mono font-bold tabular-nums">
              {formatDuration(duration)}
            </span>
          </Badge>
          <Badge
            variant="destructive"
            className="px-3 py-1.5 bg-blue-600 rounded-md flex items-center space-x-1.5 shadow-lg shadow-blue-900/20"
          >
            <span className="uppercase text-[10px] font-semibold">Live</span>
            <span className="text-xs font-semibold border-l border-white/20 pl-1.5">
              {viewerCount}
            </span>
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <Sheet>
                <SheetTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 bg-black/30 backdrop-blur-md rounded-full border border-white/10 text-white hover:bg-white/10"
                    >
                      <Settings size={16} />
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
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onEndStream}
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 bg-black/30 backdrop-blur-md rounded-full border border-white/10 text-white hover:bg-white/10"
                >
                  <X size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>End Stream</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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

      <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 pt-4 z-30 space-y-3 bg-linear-to-t from-black/90 to-transparent">
        <ChatInput
          messageInput={messageInput}
          showEmojiPicker={showEmojiPicker}
          orientation="vertical"
          onMessageChange={onMessageChange}
          onSendMessage={onSendMessage}
          onToggleEmojiPicker={onToggleEmojiPicker}
          onEmojiSelect={onEmojiSelect}
        />
        <div className="flex items-center space-x-3">
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
                  size="icon"
                  className={`w-11 h-11 rounded-full backdrop-blur-lg border transition ${
                    isMuted
                      ? "bg-amber-500/20 border-amber-500 text-amber-400"
                      : "bg-white/10 border-white/10"
                  }`}
                >
                  {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isMuted ? "Unmute" : "Mute"}</p>
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
                  size="icon"
                  className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-lg border border-white/10"
                >
                  <Sparkles
                    size={20}
                    className={currentFilter !== 0 ? "text-blue-400" : ""}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Change Filter</p>
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
                  variant="default"
                  size="icon"
                  className="w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 text-white"
                >
                  <Heart size={20} fill="currentColor" />
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
