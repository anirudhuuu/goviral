"use client";

import { useMediaDevices } from "@/hooks/useMediaDevices";
import { useMediaStream } from "@/hooks/useMediaStream";
import { SetupStage } from "@/components/SetupStage";
import { StreamOrientation, VideoQuality } from "@/types";

interface SetupStageContainerProps {
  orientation: StreamOrientation;
  streamTopic: string;
  streamerName: string;
  isMuted: boolean;
  isVideoEnabled: boolean;
  currentFilter: number;
  quality: VideoQuality;
  isPracticeMode: boolean;
  onOrientationChange: (orientation: StreamOrientation) => void;
  onStreamTopicChange: (topic: string) => void;
  onStreamerNameChange: (name: string) => void;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleFilter: () => void;
  onGoLive: () => void;
  onQualityChange: (quality: VideoQuality) => void;
  onPracticeModeChange: (enabled: boolean) => void;
}

export const SetupStageContainer: React.FC<SetupStageContainerProps> = ({
  orientation,
  streamTopic,
  streamerName,
  isMuted,
  isVideoEnabled,
  currentFilter,
  quality,
  isPracticeMode,
  onOrientationChange,
  onStreamTopicChange,
  onStreamerNameChange,
  onToggleMute,
  onToggleVideo,
  onToggleFilter,
  onGoLive,
  onQualityChange,
  onPracticeModeChange,
}) => {
  const {
    devices,
    selectedVideoDeviceId,
    selectedAudioDeviceId,
    setSelectedVideoDeviceId,
    setSelectedAudioDeviceId,
  } = useMediaDevices();

  const { currentStream } = useMediaStream({
    orientation,
    selectedVideoDeviceId,
    selectedAudioDeviceId,
    isMuted,
    isVideoEnabled,
    quality,
  });

  return (
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
      onOrientationChange={onOrientationChange}
      onStreamTopicChange={onStreamTopicChange}
      onStreamerNameChange={onStreamerNameChange}
      onToggleMute={onToggleMute}
      onToggleVideo={onToggleVideo}
      onToggleFilter={onToggleFilter}
      onGoLive={onGoLive}
      onVideoDeviceChange={setSelectedVideoDeviceId}
      onAudioDeviceChange={setSelectedAudioDeviceId}
      onQualityChange={onQualityChange}
      onPracticeModeChange={onPracticeModeChange}
    />
  );
};

