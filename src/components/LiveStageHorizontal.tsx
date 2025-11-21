import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Comment, VideoQuality } from "@/types";
import {
  Eye,
  Heart,
  Mic,
  MicOff,
  Pin,
  Sparkles,
  User,
} from "lucide-react";
import React from "react";
import { ChatInput } from "./ChatInput";
import { CommentItem } from "./CommentItem";

interface LiveStageHorizontalProps {
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

export const LiveStageHorizontal: React.FC<LiveStageHorizontalProps> = ({
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
      <div className="w-80 bg-[#09090b] border-l border-white/10 flex flex-col shrink-0 relative z-20">
        <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center bg-[#18181b] shrink-0">
          <span className="text-sm font-bold tracking-tight text-white">
            Live Chat
          </span>
        </div>

        <Card className="bg-blue-500/10 border-blue-500/20 rounded-none border-b shrink-0 py-1">
          <CardContent className="p-3 flex items-start space-x-2.5">
            <div className="bg-blue-500/20 p-1.5 rounded shrink-0 mt-0.5">
              <Pin size={12} className="text-blue-400" />
            </div>
            <div className="min-w-0 flex-1">
              <CardDescription className="text-[10px] uppercase tracking-wider text-blue-400/80 font-bold mb-1">
                Stream Topic
              </CardDescription>
              <p className="text-sm text-white font-medium leading-tight">
                {streamTopic}
              </p>
            </div>
          </CardContent>
        </Card>

        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3">
          <div className="space-y-1 min-h-full flex flex-col">
            {comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 text-center py-12">
                <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center mb-3">
                  <User size={20} className="text-zinc-500" />
                </div>
                <p className="text-sm text-zinc-500 font-medium">
                  No messages yet
                </p>
                <p className="text-xs text-zinc-600 mt-1">
                  Be the first to comment!
                </p>
              </div>
            ) : (
              <>
                <div className="flex-1" />
                {regularComments.map((c) => (
                  <CommentItem
                    key={c.id}
                    comment={c}
                    orientation="horizontal"
                    onPin={onPinComment}
                    onUnpin={onUnpinComment}
                  />
                ))}
              </>
            )}
          </div>
        </div>

        {pinnedComments.length > 0 && (
          <div className="px-3 py-2 border-t border-white/10 bg-[#18181b]/50 shrink-0">
            {pinnedComments.map((c) => (
              <CommentItem
                key={c.id}
                comment={c}
                orientation="horizontal"
                onPin={onPinComment}
                onUnpin={onUnpinComment}
              />
            ))}
          </div>
        )}

        <div className="p-3 border-t border-white/10 bg-[#18181b] shrink-0 space-y-3">
          <ChatInput
            messageInput={messageInput}
            showEmojiPicker={showEmojiPicker}
            orientation="horizontal"
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
      </div>

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
    </>
  );
};
