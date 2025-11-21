"use client";

import { useRecording } from "@/hooks/useRecording";
import { Comment, Reaction, StreamOrientation, VideoQuality } from "@/types";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface StreamContextType {
  orientation: StreamOrientation;
  streamTopic: string;
  streamerName: string;
  isMuted: boolean;
  isVideoEnabled: boolean;
  currentFilter: number;
  quality: VideoQuality;
  isPracticeMode: boolean;
  showPracticeStats: boolean;
  comments: Comment[];
  reactions: Reaction[];
  messageInput: string;
  showEmojiPicker: boolean;
  viewerCountState: number;
  chatContainerRef: React.RefObject<HTMLDivElement | null>;
  lastReactionTimeRef: React.RefObject<number>;
  setOrientation: (orientation: StreamOrientation) => void;
  setStreamTopic: (topic: string) => void;
  setStreamerName: (name: string) => void;
  setIsMuted: (muted: boolean) => void;
  setIsVideoEnabled: (enabled: boolean) => void;
  setCurrentFilter: (filter: number) => void;
  setQuality: (quality: VideoQuality) => void;
  setIsPracticeMode: (enabled: boolean) => void;
  setShowPracticeStats: (show: boolean) => void;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  setReactions: React.Dispatch<React.SetStateAction<Reaction[]>>;
  setMessageInput: (input: string) => void;
  setShowEmojiPicker: (show: boolean) => void;
  setViewerCountState: (count: number) => void;
  toggleFilter: () => void;
  addComment: (comment: Comment) => void;
  addReaction: (reaction: Reaction) => void;
  pinComment: (commentId: number) => void;
  unpinComment: (commentId: number) => void;
  downloadUrl: string | null;
  recordingDuration: number;
  recordingMimeType: string;
  mediaRecorderRef: React.RefObject<MediaRecorder | null>;
  startRecording: (stream: MediaStream, preserveChunks?: boolean) => void;
  stopRecording: () => void;
  resetRecording: () => void;
}

const StreamContext = createContext<StreamContextType | undefined>(undefined);

export const useStreamContext = () => {
  const context = useContext(StreamContext);
  if (!context) {
    throw new Error("useStreamContext must be used within StreamProvider");
  }
  return context;
};

interface StreamProviderProps {
  children: ReactNode;
}

export const StreamProvider: React.FC<StreamProviderProps> = ({ children }) => {
  // Set default orientation based on screen size: horizontal for larger screens, vertical for mobile
  const getDefaultOrientation = (): StreamOrientation => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 768 ? "horizontal" : "vertical";
    }
    return "horizontal"; // Default to horizontal for SSR
  };

  const [orientation, setOrientation] = useState<StreamOrientation>(
    getDefaultOrientation()
  );

  // Initial orientation is set via getDefaultOrientation() in useState
  // User can manually change it - we don't override their choice
  const [streamTopic, setStreamTopic] = useState("Just chatting! ☕️");
  const [streamerName, setStreamerName] = useState("You");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [currentFilter, setCurrentFilter] = useState(0);
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
    downloadUrl,
    duration: recordingDuration,
    mimeType: recordingMimeType,
    mediaRecorderRef,
    startRecording,
    stopRecording,
    resetRecording,
  } = useRecording();

  const toggleFilter = useCallback(() => {
    setCurrentFilter((prev) => (prev + 1) % 3);
  }, []);

  const addComment = useCallback((comment: Comment) => {
    setComments((prev) => [...prev, comment]);
  }, []);

  const addReaction = useCallback((reaction: Reaction) => {
    setReactions((prev) => [...prev, reaction]);
  }, []);

  const pinComment = useCallback((commentId: number) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, isPinned: true }
          : { ...c, isPinned: false }
      )
    );
  }, []);

  const unpinComment = useCallback((commentId: number) => {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, isPinned: false } : c))
    );
  }, []);

  const value: StreamContextType = {
    orientation,
    streamTopic,
    streamerName,
    isMuted,
    isVideoEnabled,
    currentFilter,
    quality,
    isPracticeMode,
    showPracticeStats,
    comments,
    reactions,
    messageInput,
    showEmojiPicker,
    viewerCountState,
    chatContainerRef,
    lastReactionTimeRef,
    setOrientation,
    setStreamTopic,
    setStreamerName,
    setIsMuted,
    setIsVideoEnabled,
    setCurrentFilter,
    setQuality,
    setIsPracticeMode,
    setShowPracticeStats,
    setComments,
    setReactions,
    setMessageInput,
    setShowEmojiPicker,
    setViewerCountState,
    toggleFilter,
    addComment,
    addReaction,
    pinComment,
    unpinComment,
    downloadUrl,
    recordingDuration,
    recordingMimeType,
    mediaRecorderRef,
    startRecording,
    stopRecording,
    resetRecording,
  };

  return (
    <StreamContext.Provider value={value}>{children}</StreamContext.Provider>
  );
};
