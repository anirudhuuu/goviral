import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Comment, VideoQuality } from "@/types";
import { AnimatePresence } from "framer-motion";
import {
  Eye,
  Heart,
  Mic,
  MicOff,
  Pin,
  Sparkles,
  X,
} from "lucide-react";
import React from "react";
import { ChatInput } from "./ChatInput";
import { CommentItem } from "./CommentItem";

interface LiveStageVerticalProps {
  viewerCount: number;
  duration: number;
  streamTopic: string;
  comments: Comment[];
  messageInput: string;
  showEmojiPicker: boolean;
  isMuted: boolean;
  currentFilter: number;
  chatContainerRef: React.RefObject<HTMLDivElement | null>;
  onEndStream: () => void;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onToggleEmojiPicker: () => void;
  onEmojiSelect: (emoji: string) => void;
  onToggleMute: () => void;
  onToggleFilter: () => void;
  onTriggerReaction: (type: string) => void;
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
  chatContainerRef,
  onEndStream,
  onMessageChange,
  onSendMessage,
  onToggleEmojiPicker,
  onEmojiSelect,
  onToggleMute,
  onToggleFilter,
  onTriggerReaction,
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
      <div className="absolute top-0 inset-x-0 h-24 bg-linear-to-b from-black/90 via-black/60 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-80 bg-linear-to-t from-black/95 via-black/70 to-transparent z-10 pointer-events-none" />

      <div className="absolute top-0 left-0 right-0 pt-3 pb-2 px-3 z-50 pointer-events-none">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Badge
              variant="destructive"
              className="bg-red-600 text-white px-2.5 py-1 rounded-md font-semibold text-xs tracking-wider uppercase shadow-lg flex items-center gap-1.5 pointer-events-auto"
            >
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              LIVE
            </Badge>
            <Badge
              variant="outline"
              className="bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md border-white/20 flex items-center text-white pointer-events-auto"
            >
              <span className="text-xs font-mono font-bold tabular-nums">
                {formatDuration(duration)}
              </span>
            </Badge>
          </div>
          <div className="flex items-center gap-2 pointer-events-auto">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="outline"
                    className="bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md border-white/20 flex items-center gap-1.5 cursor-default"
                  >
                    <Eye size={12} className="text-white/80" />
                    <span className="text-xs font-bold text-white">
                      {viewerCount}
                    </span>
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
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 bg-red-600/90 backdrop-blur-md rounded-full border border-red-500/50 text-white hover:bg-red-600 hover:border-red-400"
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
      </div>

      <Card className="absolute top-16 left-0 right-0 z-40 bg-black/60 backdrop-blur-xl border-white/10 rounded-none border-x-0 border-t-0 p-3 max-w-none">
        <div className="flex items-start gap-2.5">
          <div className="bg-blue-500/90 p-1.5 rounded-lg text-white shrink-0">
            <Pin size={12} />
          </div>
          <p className="text-sm font-medium text-white leading-snug line-clamp-2 flex-1">
            {streamTopic}
          </p>
        </div>
      </Card>

      <div
        ref={chatContainerRef}
        className="absolute bottom-36 left-0 right-0 z-20 px-3 overflow-y-auto pointer-events-auto"
        style={{ height: "calc(100% - 36rem)", maxHeight: "40%" }}
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
        <div className="absolute bottom-36 left-0 right-0 px-3 z-30 pointer-events-auto">
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

      <div className="absolute bottom-0 left-0 right-0 px-3 pb-4 lg:pb-6 pt-6 z-50 space-y-3 bg-linear-to-t from-black/95 via-black/80 to-transparent pointer-events-auto">
        <ChatInput
          messageInput={messageInput}
          showEmojiPicker={showEmojiPicker}
          orientation="vertical"
          onMessageChange={onMessageChange}
          onSendMessage={onSendMessage}
          onToggleEmojiPicker={onToggleEmojiPicker}
          onEmojiSelect={onEmojiSelect}
        />
        <div className="flex items-center justify-center gap-3">
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
                  className={`h-12 w-12 rounded-full backdrop-blur-lg border transition-all ${
                    isMuted
                      ? "bg-amber-500/30 border-amber-500/60 text-amber-400 shadow-lg shadow-amber-500/20"
                      : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                  }`}
                >
                  {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
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
                  className={`h-12 w-12 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 transition-all ${
                    currentFilter !== 0 ? "border-red-500/50 bg-red-500/20" : ""
                  }`}
                >
                  <Sparkles
                    size={22}
                    className={currentFilter !== 0 ? "text-red-400" : ""}
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
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-red-600/90 backdrop-blur-lg border border-red-500/50 text-white hover:bg-red-600 hover:border-red-400 shadow-lg shadow-red-500/20 transition-all"
                >
                  <Heart size={22} fill="currentColor" />
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
