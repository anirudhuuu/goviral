"use client";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SetupStageContainer } from "@/components/setup/SetupStageContainer";
import { useStreamContext } from "@/contexts/StreamContext";
import { useRouter } from "next/navigation";

function SetupPageContent() {
  const router = useRouter();
  const {
    orientation,
    streamTopic,
    streamerName,
    isMuted,
    isVideoEnabled,
    currentFilter,
    quality,
    isPracticeMode,
    setOrientation,
    setStreamTopic,
    setStreamerName,
    setIsMuted,
    setIsVideoEnabled,
    setCurrentFilter,
    setQuality,
    setIsPracticeMode,
  } = useStreamContext();

  const handleGoLive = () => {
    if (!streamTopic.trim() || !streamerName.trim()) {
      alert("Please enter both your name and a stream title");
      return;
    }
    router.push(`/live?orientation=${orientation}`);
  };

  return (
    <div className="min-h-screen bg-[#09090b] font-sans text-white overflow-hidden w-full h-screen">
      <SetupStageContainer
        orientation={orientation}
        streamTopic={streamTopic}
        streamerName={streamerName}
        isMuted={isMuted}
        isVideoEnabled={isVideoEnabled}
        currentFilter={currentFilter}
        quality={quality}
        isPracticeMode={isPracticeMode}
        onOrientationChange={setOrientation}
        onStreamTopicChange={setStreamTopic}
        onStreamerNameChange={setStreamerName}
        onToggleMute={() => setIsMuted(!isMuted)}
        onToggleVideo={() => setIsVideoEnabled(!isVideoEnabled)}
        onToggleFilter={() => setCurrentFilter((currentFilter + 1) % 3)}
        onGoLive={handleGoLive}
        onQualityChange={setQuality}
        onPracticeModeChange={setIsPracticeMode}
      />
    </div>
  );
}

export default function SetupPage() {
  return (
    <ErrorBoundary>
      <SetupPageContent />
    </ErrorBoundary>
  );
}
