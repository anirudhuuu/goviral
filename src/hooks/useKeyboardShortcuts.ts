import { useEffect } from "react";
import { StreamStage } from "@/types";

interface KeyboardShortcutsProps {
  stage: StreamStage;
  onToggleMute?: () => void;
  onToggleVideo?: () => void;
  onToggleFilter?: () => void;
  onEndStream?: () => void;
  onGoLive?: () => void;
}

export const useKeyboardShortcuts = ({
  stage,
  onToggleMute,
  onToggleVideo,
  onToggleFilter,
  onEndStream,
  onGoLive,
}: KeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "m":
            e.preventDefault();
            onToggleMute?.();
            break;
          case "v":
            e.preventDefault();
            onToggleVideo?.();
            break;
          case "f":
            e.preventDefault();
            onToggleFilter?.();
            break;
          case "e":
            if (stage === "live") {
              e.preventDefault();
              onEndStream?.();
            }
            break;
          case "l":
            if (stage === "setup") {
              e.preventDefault();
              onGoLive?.();
            }
            break;
        }
      }

      if (e.key === "Escape" && stage === "live") {
        onEndStream?.();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [stage, onToggleMute, onToggleVideo, onToggleFilter, onEndStream, onGoLive]);
};

