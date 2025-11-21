"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AnimatePresence } from "framer-motion";
import { Award } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  COMMENT_CONFIG,
  REACTION_CONFIG,
  VIDEO_FILTERS,
  VIEWER_COUNT_CONFIG,
} from "@/constants";
import {
  Comment,
  Reaction,
  StreamOrientation,
  StreamStage,
  VideoQuality,
} from "@/types";
import {
  createComment,
  getContainerClassName,
  limitComments,
} from "@/utils/helpers";

import { useAIComments } from "@/hooks/useAIComments";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useMediaDevices } from "@/hooks/useMediaDevices";
import { useMediaStream } from "@/hooks/useMediaStream";
import { useRecording } from "@/hooks/useRecording";
import { useSpeechAnalysis } from "@/hooks/useSpeechAnalysis";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useViewerCount } from "@/hooks/useViewerCount";

import { EndStage } from "./EndStage";
import { LiveStageHorizontal } from "./LiveStageHorizontal";
import { LiveStageVertical } from "./LiveStageVertical";
import { PracticeMode } from "./PracticeMode";
import { ReactionFloater } from "./ReactionFloater";
import { SetupStage } from "./SetupStage";
import { VideoFeed } from "./VideoFeed";

const App: React.FC = () => {
  const [stage, setStage] = useState<StreamStage>("setup");
  const [orientation, setOrientation] = useState<StreamOrientation>("vertical");
  const [streamTopic, setStreamTopic] = useState("Just chatting! ☕️");
  const [streamerName, setStreamerName] = useState("You");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [currentFilter, setCurrentFilter] = useState(0);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [quality, setQuality] = useState<VideoQuality>("720p");
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [showPracticeStats, setShowPracticeStats] = useState(true);

  const [comments, setComments] = useState<Comment[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [viewerCountState, setViewerCountState] = useState(0);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastReactionTimeRef = useRef<number>(0);

  const {
    devices,
    selectedVideoDeviceId,
    selectedAudioDeviceId,
    setSelectedVideoDeviceId,
    setSelectedAudioDeviceId,
  } = useMediaDevices();

  const {
    currentStream,
    streamRef,
    error: mediaError,
    isLoading: isMediaLoading,
  } = useMediaStream({
    orientation,
    selectedVideoDeviceId,
    selectedAudioDeviceId,
    isMuted,
    isVideoEnabled,
    quality,
  });

  const { transcriptBuffer, recognitionRef } = useSpeechRecognition(stage);

  const speechMetrics = useSpeechAnalysis(
    transcriptBuffer,
    stage === "live" && isPracticeMode
  );

  const {
    downloadUrl,
    duration,
    startRecording,
    stopRecording,
    resetRecording,
  } = useRecording();

  const viewerCount = useViewerCount(stage);

  useEffect(() => {
    if (stage !== "live") return;
    const rafId = requestAnimationFrame(() => {
      setViewerCountState(viewerCount);
    });
    return () => cancelAnimationFrame(rafId);
  }, [viewerCount, stage]);

  const addComment = useCallback((comment: Comment) => {
    setComments((prev) =>
      limitComments([...prev, comment], COMMENT_CONFIG.MAX_COMMENTS)
    );
  }, []);

  const reactionTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const triggerBurst = useCallback((type: string) => {
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
        setReactions((prev) => [
          ...prev,
          { id: Date.now() + Math.random(), type },
        ]);
      }, i * REACTION_CONFIG.BURST_DELAY);
      reactionTimeoutsRef.current.push(timeout);
    }
  }, []);

  useEffect(() => {
    return () => {
      reactionTimeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      reactionTimeoutsRef.current = [];
    };
  }, []);

  useAIComments({
    stage,
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
    setMessageInput("");
    setShowEmojiPicker(false);
  }, [messageInput, addComment]);

  const handleEmojiSelect = useCallback((emoji: string) => {
    setMessageInput((prev) => prev + emoji);
  }, []);

  const goLive = useCallback(() => {
    if (!streamTopic.trim() || !streamerName.trim()) {
      alert("Please enter both your name and a stream title");
      return;
    }

    if (!currentStream) {
      alert("Camera not ready. Please check your permissions.");
      return;
    }

    setStage("live");
    setViewerCountState(VIEWER_COUNT_CONFIG.INITIAL_COUNT);
    setComments([]);
    setShowEndConfirm(false);
    resetRecording();

    if (streamRef.current) {
      startRecording(streamRef.current);
    }

    if (orientation === "vertical") {
      addComment(createComment("System", `Live: ${streamTopic}`, true));
    }
  }, [
    streamTopic,
    streamerName,
    currentStream,
    streamRef,
    startRecording,
    resetRecording,
    orientation,
    addComment,
  ]);

  const handleEndStreamClick = useCallback(() => {
    setShowEndConfirm(true);
  }, []);

  const confirmEndStream = useCallback(() => {
    setStage("end");
    setShowEndConfirm(false);
    recognitionRef.current?.stop();
    stopRecording();
  }, [recognitionRef, stopRecording]);

  const removeReaction = useCallback((id: number) => {
    setReactions((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const toggleFilter = useCallback(() => {
    setCurrentFilter((prev) => (prev + 1) % VIDEO_FILTERS.length);
  }, []);

  const handleReturnToStudio = useCallback(() => {
    setStage("setup");
  }, []);

  const handlePinComment = useCallback((commentId: number) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, isPinned: true }
          : { ...c, isPinned: false }
      )
    );
  }, []);

  const handleUnpinComment = useCallback((commentId: number) => {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, isPinned: false } : c))
    );
  }, []);

  useKeyboardShortcuts({
    stage,
    onToggleMute: () => setIsMuted(!isMuted),
    onToggleVideo: () => setIsVideoEnabled(!isVideoEnabled),
    onToggleFilter: toggleFilter,
    onEndStream: handleEndStreamClick,
    onGoLive: goLive,
  });

  const containerClass = getContainerClassName(orientation);
  const isSetupStage = stage === "setup";

  return (
    <div
      className={`min-h-screen bg-[#09090b] font-sans text-white overflow-hidden ${
        isSetupStage
          ? "w-full h-screen"
          : "flex items-center justify-center p-4 lg:p-0 lg:h-screen"
      }`}
    >
      {isSetupStage ? (
        stage === "setup" && (
          <SetupStage
            orientation={orientation}
            streamTopic={streamTopic}
            streamerName={streamerName}
            isMuted={isMuted}
            isVideoEnabled={isVideoEnabled}
            currentFilter={currentFilter}
            currentStream={currentStream}
            devices={devices}
            selectedVideoDeviceId={selectedVideoDeviceId}
            selectedAudioDeviceId={selectedAudioDeviceId}
            selectedQuality={quality}
            isPracticeMode={isPracticeMode}
            onOrientationChange={setOrientation}
            onStreamTopicChange={setStreamTopic}
            onStreamerNameChange={setStreamerName}
            onToggleMute={() => setIsMuted(!isMuted)}
            onToggleVideo={() => setIsVideoEnabled(!isVideoEnabled)}
            onToggleFilter={toggleFilter}
            onGoLive={goLive}
            onVideoDeviceChange={setSelectedVideoDeviceId}
            onAudioDeviceChange={setSelectedAudioDeviceId}
            onQualityChange={setQuality}
            onPracticeModeChange={setIsPracticeMode}
          />
        )
      ) : (
        <div
          className={`relative bg-black overflow-hidden transition-all duration-500 flex shadow-2xl lg:shadow-none ring-1 ring-white/10 lg:ring-0 ${containerClass}`}
        >
          {stage === "live" && (
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
                <LiveStageHorizontal
                  viewerCount={viewerCountState}
                  duration={duration}
                  streamTopic={streamTopic}
                  comments={comments}
                  messageInput={messageInput}
                  showEmojiPicker={showEmojiPicker}
                  isMuted={isMuted}
                  currentFilter={currentFilter}
                  devices={devices}
                  selectedVideoDeviceId={selectedVideoDeviceId}
                  selectedAudioDeviceId={selectedAudioDeviceId}
                  selectedQuality={quality}
                  chatContainerRef={chatContainerRef}
                  onEndStream={handleEndStreamClick}
                  onMessageChange={setMessageInput}
                  onSendMessage={handleSendMessage}
                  onToggleEmojiPicker={() =>
                    setShowEmojiPicker(!showEmojiPicker)
                  }
                  onEmojiSelect={handleEmojiSelect}
                  onToggleMute={() => setIsMuted(!isMuted)}
                  onToggleFilter={toggleFilter}
                  onTriggerReaction={triggerBurst}
                  onVideoDeviceChange={setSelectedVideoDeviceId}
                  onAudioDeviceChange={setSelectedAudioDeviceId}
                  onQualityChange={setQuality}
                  onPinComment={handlePinComment}
                  onUnpinComment={handleUnpinComment}
                />
              )}
            </div>
          )}

          {stage === "live" && orientation === "vertical" && (
            <LiveStageVertical
              viewerCount={viewerCountState}
              duration={duration}
              streamTopic={streamTopic}
              comments={comments}
              messageInput={messageInput}
              showEmojiPicker={showEmojiPicker}
              isMuted={isMuted}
              currentFilter={currentFilter}
              devices={devices}
              selectedVideoDeviceId={selectedVideoDeviceId}
              selectedAudioDeviceId={selectedAudioDeviceId}
              selectedQuality={quality}
              chatContainerRef={chatContainerRef}
              onEndStream={handleEndStreamClick}
              onMessageChange={setMessageInput}
              onSendMessage={handleSendMessage}
              onToggleEmojiPicker={() => setShowEmojiPicker(!showEmojiPicker)}
              onEmojiSelect={handleEmojiSelect}
              onToggleMute={() => setIsMuted(!isMuted)}
              onToggleFilter={toggleFilter}
              onTriggerReaction={triggerBurst}
              onVideoDeviceChange={setSelectedVideoDeviceId}
              onAudioDeviceChange={setSelectedAudioDeviceId}
              onQualityChange={setQuality}
              onPinComment={handlePinComment}
              onUnpinComment={handleUnpinComment}
            />
          )}

          {stage === "live" && isPracticeMode && (
            <PracticeMode
              wordsPerMinute={speechMetrics.wordsPerMinute}
              fillerWordsCount={speechMetrics.fillerWordsCount}
              totalWords={speechMetrics.totalWords}
              confidenceScore={speechMetrics.confidenceScore}
              isVisible={showPracticeStats}
              onClose={() => setShowPracticeStats(false)}
            />
          )}

          {stage === "live" && isPracticeMode && !showPracticeStats && (
            <Button
              onClick={() => setShowPracticeStats(true)}
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

          {stage === "end" && (
            <EndStage
              viewerCount={viewerCountState}
              commentCount={comments.length}
              duration={duration}
              downloadUrl={downloadUrl}
              streamTopic={streamTopic}
              streamerName={streamerName}
              onReturnToStudio={handleReturnToStudio}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default App;
