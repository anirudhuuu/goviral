import { ReactionType, VideoFilter } from "@/types";

export const PROFILE_COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
] as const;

export const EMOJI_REACTIONS: Record<ReactionType, string> = {
  love: "❤️",
  laugh: "😂",
  fire: "🔥",
  clap: "👏",
  shock: "😮",
  sad: "😢",
  hundred: "💯",
  party: "🎉",
} as const;

export const VIDEO_FILTERS: VideoFilter[] = [
  { name: "Normal", class: "" },
  {
    name: "Warm",
    class: "sepia-[.2] contrast-105 brightness-105 saturate-125",
  },
  { name: "Cool", class: "hue-rotate-15 contrast-105 brightness-105" },
  { name: "B&W", class: "grayscale contrast-110" },
] as const;

export const VIEWER_COUNT_CONFIG = {
  INITIAL_COUNT: 120,
  UPDATE_INTERVAL: 2000,
  MIN_COUNT: 10,
  MAX_CHANGE: 9,
  VARIANCE: 3,
} as const;

export const COMMENT_CONFIG = {
  MAX_COMMENTS: 50,
  MAX_MESSAGE_LENGTH: 200,
  ANIMATION_DELAY: 800,
  ANIMATION_VARIANCE: 200,
} as const;

export const SPEECH_CONFIG = {
  BUFFER_THRESHOLD: 20,
  CHECK_INTERVAL: 4000,
  LANGUAGE: "en-IN",
} as const;

export const REACTION_CONFIG = {
  DEBOUNCE_TIME: 20,
  BURST_COUNT_MIN: 3,
  BURST_COUNT_MAX: 5,
  BURST_DELAY: 80,
  TRIGGER_DELAY: 500,
} as const;
