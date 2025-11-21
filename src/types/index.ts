export type StreamStage = "setup" | "live" | "end";

export type StreamOrientation = "vertical" | "horizontal";

export type ReactionType =
  | "love"
  | "laugh"
  | "fire"
  | "clap"
  | "shock"
  | "sad"
  | "hundred"
  | "party";

export interface Comment {
  id: number;
  user: string;
  text: string;
  isSystem?: boolean;
  isPinned?: boolean;
}

export interface Reaction {
  id: number;
  type: string;
}

export interface VideoFilter {
  name: string;
  class: string;
}

export interface AIResponse {
  comments: Array<{
    user?: string;
    text: string;
  }>;
  dominantReaction: ReactionType;
}

export interface DeviceState {
  devices: MediaDeviceInfo[];
  selectedVideoDeviceId: string;
  selectedAudioDeviceId: string;
}

export interface StreamState {
  stage: StreamStage;
  orientation: StreamOrientation;
  streamTopic: string;
  streamerName: string;
  isMuted: boolean;
  isVideoEnabled: boolean;
  currentFilter: number;
  showEndConfirm: boolean;
  viewerCount: number;
}

export interface ChatState {
  comments: Comment[];
  reactions: Reaction[];
  messageInput: string;
  showEmojiPicker: boolean;
}

export interface RecordingState {
  transcriptBuffer: string;
  lastProcessedTranscript: string;
  recordedChunks: Blob[];
  downloadUrl: string | null;
  currentStream: MediaStream | null;
}

export type VideoQuality = "360p" | "720p" | "1080p";
