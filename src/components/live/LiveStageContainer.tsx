"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Award } from "lucide-react";
import { useMediaDevices } from "@/hooks/useMediaDevices";
import { useMediaStream } from "@/hooks/useMediaStream";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useAIComments } from "@/hooks/useAIComments";
import { useViewerCount } from "@/hooks/useViewerCount";
import { useRecording } from "@/hooks/useRecording";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useSpeechAnalysis } from "@/hooks/useSpeechAnalysis";
import { VideoFeed } from "@/components/VideoFeed";
import { ReactionFloater } from "@/components/ReactionFloater";
import { LiveStageVertical } from "@/components/LiveStageVertical";
import { LiveStageHorizontal } from "@/components/LiveStageHorizontal";
import { PracticeMode } from "@/components/PracticeMode";
import { useStreamContext } from "@/contexts/StreamContext";
import { StreamOrientation, Comment, Reaction, VideoQuality } from "@/types";
import { VIDEO_FILTERS, REACTION_CONFIG, COMMENT_CONFIG } from "@/constants";
import { createComment, limitComments, getContainerClassName } from "@/utils/helpers";

interface LiveStageContainerProps {
  orientation: StreamOrientation;
  streamTopic: string;
  comments: Comment[];
  messageInput: string;
  showEmojiPicker: boolean;
  isMuted: boolean;
  currentFilter: number;
  quality: VideoQuality;
  isPracticeMode: boolean;
  showPracticeStats: boolean;
  viewerCountState: number;
  chatContainerRef: React.RefObject<HTMLDivElement | null>;
  onEndStream: () => void;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onToggleEmojiPicker: () => void;
  onEmojiSelect: (emoji: string) => void;
  onToggleMute: () => void;
  onToggleFilter: () => void;
  onTriggerReaction: (type: string) => void;
  onQualityChange: (quality: VideoQuality) => void;
  onPracticeModeChange: (enabled: boolean) => void;
  onShowPracticeStatsChange: (show: boolean) => void;
  onViewerCountChange: (count: number) => void;
  onPinComment: (commentId: number) => void;
  onUnpinComment: (commentId: number) => void;
}

export const LiveStageContainer: React.FC<LiveStageContainerProps> = ({
  orientation,
  streamTopic,
  comments,
  messageInput,
  showEmojiPicker,
  isMuted,
  currentFilter,
  quality,
  isPracticeMode,
  showPracticeStats,
  viewerCountState,
  chatContainerRef,
  onEndStream,
  onMessageChange,
  onSendMessage,
  onToggleEmojiPicker,
  onEmojiSelect,
  onToggleMute,
  onToggleFilter,
  onTriggerReaction,
  onQualityChange,
  onPracticeModeChange,
  onShowPracticeStatsChange,
  onViewerCountChange,
  onPinComment,
  onUnpinComment,
}) => {
  const router = useRouter();
  const {
    setComments,
    setReactions,
    reactions,
    addComment: contextAddComment,
    addReaction: contextAddReaction,
    lastReactionTimeRef,
    downloadUrl,
    recordingDuration,
    mediaRecorderRef,
    startRecording,
    stopRecording,
    resetRecording,
  } = useStreamContext();

  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [duration, setDuration] = useState(recordingDuration);

  const {
    devices,
    selectedVideoDeviceId,
    selectedAudioDeviceId,
    setSelectedVideoDeviceId,
    setSelectedAudioDeviceId,
  } = useMediaDevices();

  const { currentStream, streamRef } = useMediaStream({
    orientation,
    selectedVideoDeviceId,
    selectedAudioDeviceId,
    isMuted,
    isVideoEnabled: true,
    quality,
  });

  const { transcriptBuffer, recognitionRef } = useSpeechRecognition("live");

  const speechMetrics = useSpeechAnalysis(
    transcriptBuffer,
    isPracticeMode
  );

  const viewerCount = useViewerCount("live");

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      onViewerCountChange(viewerCount);
    });
    return () => cancelAnimationFrame(rafId);
  }, [viewerCount, onViewerCountChange]);

  useEffect(() => {
    if (currentStream && streamRef.current) {
      startRecording(streamRef.current);
    }
    return () => {
      stopRecording();
    };
  }, [currentStream, startRecording, stopRecording]);

  useEffect(() => {
    setDuration(recordingDuration);
  }, [recordingDuration]);

  const addComment = useCallback(
    (comment: Comment) => {
      setComments((prev) =>
        limitComments([...prev, comment], COMMENT_CONFIG.MAX_COMMENTS)
      );
    },
    [setComments]
  );

  const reactionTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const triggerBurst = useCallback(
    (type: string) => {
      const now = Date.now();
      if (now - lastReactionTimeRef.current < REACTION_CONFIG.DEBOUNCE_TIME)
        return;
      lastReactionTimeRef.current = now;

      const count =
        Math.floor(
          Math.random() *
            (REACTION_CONFIG.BURST_COUNT_MAX -
              REACTION_CONFIG.BURST_COUNT_MIN +
              1)
        ) + REACTION_CONFIG.BURST_COUNT_MIN;
      for (let i = 0; i < count; i++) {
        const timeout = setTimeout(() => {
          contextAddReaction({ id: Date.now() + Math.random(), type });
        }, i * REACTION_CONFIG.BURST_DELAY);
        reactionTimeoutsRef.current.push(timeout);
      }
    },
    [contextAddReaction]
  );

  useEffect(() => {
    return () => {
      reactionTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      reactionTimeoutsRef.current = [];
    };
  }, []);

  useAIComments({
    stage: "live",
    transcriptBuffer,
    streamTopic,
    onAddComment: addComment,
    onTriggerReaction: triggerBurst,
  });

  useEffect(() => {
    if (chatContainerRef.current) {
      const scrollToBottom = () => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
        }
      };
      requestAnimationFrame(() => {
        requestAnimationFrame(scrollToBottom);
      });
    }
  }, [comments]);

  const handleSendMessage = useCallback(() => {
    if (!messageInput.trim()) return;
    addComment(createComment("You", messageInput, false));
    onMessageChange("");
  }, [messageInput, addComment, onMessageChange]);

  const handleEndStreamClick = useCallback(() => {
    setShowEndConfirm(true);
  }, []);

  const confirmEndStream = useCallback(() => {
    recognitionRef.current?.stop();
    
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      const handleStop = () => {
        setTimeout(() => {
          router.push("/end");
        }, 500);
      };
      
      mediaRecorder.addEventListener("stop", handleStop, { once: true });
      stopRecording();
    } else {
      setTimeout(() => {
        router.push("/end");
      }, 500);
    }
  }, [stopRecording, router]);

  const removeReaction = useCallback(
    (id: number) => {
      setReactions((prev) => prev.filter((r) => r.id !== id));
    },
    [setReactions]
  );


  useKeyboardShortcuts({
    stage: "live",
    onToggleMute,
    onToggleVideo: () => {},
    onToggleFilter,
    onEndStream: handleEndStreamClick,
    onGoLive: () => {},
  });

  const containerClass = getContainerClassName(orientation);

  const liveStageProps = {
    viewerCount: viewerCountState,
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
    selectedQuality: quality,
    chatContainerRef,
    onEndStream: handleEndStreamClick,
    onMessageChange,
    onSendMessage: handleSendMessage,
    onToggleEmojiPicker,
    onEmojiSelect,
    onToggleMute,
    onToggleFilter,
    onTriggerReaction: triggerBurst,
    onVideoDeviceChange: setSelectedVideoDeviceId,
    onAudioDeviceChange: setSelectedAudioDeviceId,
    onQualityChange,
    onPinComment,
    onUnpinComment,
  };

  return (
    <>
      <div
        className={`relative bg-black overflow-hidden transition-all duration-500 flex shadow-2xl lg:shadow-none ring-1 ring-white/10 lg:ring-0 ${containerClass}`}
      >
        <div
          className={`relative w-full h-full bg-zinc-900 ${
            orientation === "horizontal" ? "flex" : ""
          }`}
        >
          <div
            className={`relative overflow-hidden ${
              orientation === "horizontal"
                ? "flex-1 h-full"
                : "w-full h-full"
            }`}
          >
            <VideoFeed
              stream={currentStream}
              filterClass={VIDEO_FILTERS[currentFilter].class}
            />

            {orientation === "vertical" && (
              <>
                <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-10 pointer-events-none" />
                <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10 pointer-events-none" />
              </>
            )}
          </div>

          {orientation === "horizontal" && (
            <LiveStageHorizontal {...liveStageProps} />
          )}
        </div>

        {orientation === "vertical" && <LiveStageVertical {...liveStageProps} />}

        {isPracticeMode && (
          <PracticeMode
            wordsPerMinute={speechMetrics.wordsPerMinute}
            fillerWordsCount={speechMetrics.fillerWordsCount}
            totalWords={speechMetrics.totalWords}
            confidenceScore={speechMetrics.confidenceScore}
            isVisible={showPracticeStats}
            onClose={() => onShowPracticeStatsChange(false)}
          />
        )}

        {isPracticeMode && !showPracticeStats && (
          <Button
            onClick={() => onShowPracticeStatsChange(true)}
            className="fixed bottom-4 right-4 z-[100] bg-red-600 hover:bg-red-700"
            size="sm"
          >
            <Award size={16} className="mr-2" />
            Show Stats
          </Button>
        )}

        <AnimatePresence>
          {reactions.map((reaction) => (
            <ReactionFloater
              key={reaction.id}
              id={reaction.id}
              type={reaction.type}
              orientation={orientation}
              onComplete={removeReaction}
            />
          ))}
        </AnimatePresence>

        <Dialog open={showEndConfirm} onOpenChange={setShowEndConfirm}>
          <DialogContent className="bg-[#18181b] border-white/10 text-white max-w-xs">
            <DialogHeader>
              <DialogTitle>End Stream?</DialogTitle>
              <DialogDescription className="text-zinc-400">
                The broadcast will stop immediately and a recording will be
                saved.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-row gap-3">
              <Button
                onClick={() => setShowEndConfirm(false)}
                variant="outline"
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmEndStream}
                variant="destructive"
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                End Now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

