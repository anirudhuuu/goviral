"use client";

import { EndStage } from "@/components/EndStage";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useStreamContext } from "@/contexts/StreamContext";
import { useRouter } from "next/navigation";

function EndPageContent() {
  const router = useRouter();
  const {
    viewerCountState,
    comments,
    downloadUrl,
    recordingDuration,
    recordingMimeType,
    streamTopic,
    streamerName,
  } = useStreamContext();

  const handleReturnToStudio = () => {
    router.push("/setup");
  };

  return (
    <div className="min-h-screen bg-[#09090b] font-sans text-white overflow-hidden flex items-center justify-center p-4 lg:p-0 lg:h-screen">
      <EndStage
        viewerCount={viewerCountState}
        commentCount={comments.length}
        duration={recordingDuration}
        downloadUrl={downloadUrl}
        mimeType={recordingMimeType}
        streamTopic={streamTopic}
        streamerName={streamerName}
        onReturnToStudio={handleReturnToStudio}
      />
    </div>
  );
}

export default function EndPage() {
  return (
    <ErrorBoundary>
      <EndPageContent />
    </ErrorBoundary>
  );
}
