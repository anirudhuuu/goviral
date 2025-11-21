"use client";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LiveStageContainer } from "@/components/live/LiveStageContainer";
import { useStreamContext } from "@/contexts/StreamContext";
import { createComment } from "@/utils/helpers";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function LivePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orientationParam = searchParams.get("orientation");
  const {
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
    setOrientation,
    setMessageInput,
    setShowEmojiPicker,
    setIsMuted,
    setQuality,
    setIsPracticeMode,
    setShowPracticeStats,
    setViewerCountState,
    toggleFilter,
    addComment,
    pinComment,
    unpinComment,
  } = useStreamContext();

  useEffect(() => {
    if (orientationParam === "vertical" || orientationParam === "horizontal") {
      setOrientation(orientationParam);
    }
  }, [orientationParam, setOrientation]);

  const handleEndStream = () => {
    router.push("/setup");
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    addComment(createComment("You", messageInput, false));
    setMessageInput("");
    setShowEmojiPicker(false);
  };

  return (
    <div
      className={`min-h-screen bg-[#09090b] font-sans text-white overflow-hidden flex items-center justify-center ${
        orientation === "vertical" ? "p-0 h-screen lg:p-4" : "p-4 lg:p-0 lg:h-screen"
      }`}
    >
      <LiveStageContainer
        orientation={orientation}
        streamTopic={streamTopic}
        comments={comments}
        messageInput={messageInput}
        showEmojiPicker={showEmojiPicker}
        isMuted={isMuted}
        currentFilter={currentFilter}
        quality={quality}
        isPracticeMode={isPracticeMode}
        showPracticeStats={showPracticeStats}
        viewerCountState={viewerCountState}
        chatContainerRef={chatContainerRef}
        onEndStream={handleEndStream}
        onMessageChange={setMessageInput}
        onSendMessage={handleSendMessage}
        onToggleEmojiPicker={() => setShowEmojiPicker(!showEmojiPicker)}
        onEmojiSelect={(emoji: string) => setMessageInput(messageInput + emoji)}
        onToggleMute={() => setIsMuted(!isMuted)}
        onToggleFilter={toggleFilter}
        onTriggerReaction={() => {}}
        onQualityChange={setQuality}
        onPracticeModeChange={setIsPracticeMode}
        onShowPracticeStatsChange={setShowPracticeStats}
        onViewerCountChange={setViewerCountState}
        onPinComment={pinComment}
        onUnpinComment={unpinComment}
      />
    </div>
  );
}

export default function LivePage() {
  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-white">
            Loading...
          </div>
        }
      >
        <LivePageContent />
      </Suspense>
    </ErrorBoundary>
  );
}
