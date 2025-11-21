import { useEffect, useState, useCallback, useRef } from "react";
import { aiService } from "@/services/aiService";
import { Comment, StreamStage } from "@/types";
import { SPEECH_CONFIG, COMMENT_CONFIG } from "@/constants";
import { createComment } from "@/utils/helpers";

interface UseAICommentsProps {
  stage: StreamStage;
  transcriptBuffer: string;
  streamTopic: string;
  onAddComment: (comment: Comment) => void;
  onTriggerReaction: (type: string) => void;
}

interface UseAICommentsReturn {
  lastProcessedTranscript: string;
}

export const useAIComments = ({
  stage,
  transcriptBuffer,
  streamTopic,
  onAddComment,
  onTriggerReaction,
}: UseAICommentsProps): UseAICommentsReturn => {
  const [lastProcessedTranscript, setLastProcessedTranscript] = useState("");

  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const processTranscript = useCallback(async () => {
    const bufferLength = transcriptBuffer.length;
    const currentLastLength = lastProcessedTranscript.length;

    if (bufferLength - currentLastLength > SPEECH_CONFIG.BUFFER_THRESHOLD) {
      const newText = transcriptBuffer.substring(currentLastLength);
      // Update state immediately to prevent duplicate processing
      setLastProcessedTranscript(transcriptBuffer);

      const aiData = await aiService.generateResponse(
        newText,
        transcriptBuffer.substring(0, currentLastLength), // Use the old lastProcessedTranscript value
        streamTopic
      );

      if (aiData && aiData.comments) {
        const baseDelay = Math.random() * 2000 + 1000;
        aiData.comments.forEach(
          (c: { user?: string; text: string }, i: number) => {
            const jitter = Math.random() * 1500;
            const timeout = setTimeout(() => {
              onAddComment(createComment(c.user || "Guest", c.text, false));
            }, baseDelay + i * COMMENT_CONFIG.ANIMATION_DELAY + jitter);
            timeoutsRef.current.push(timeout);
          }
        );

        if (aiData.dominantReaction) {
          const reactionDelay = Math.random() * 2000 + 1500;
          const timeout = setTimeout(
            () => onTriggerReaction(aiData.dominantReaction),
            reactionDelay
          );
          timeoutsRef.current.push(timeout);
        }
      }
    }
  }, [
    transcriptBuffer,
    lastProcessedTranscript,
    streamTopic,
    onAddComment,
    onTriggerReaction,
  ]);

  useEffect(() => {
    if (stage !== "live") return;

    const interval = setInterval(
      processTranscript,
      SPEECH_CONFIG.CHECK_INTERVAL
    );

    return () => {
      clearInterval(interval);
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      timeoutsRef.current = [];
    };
  }, [stage, processTranscript]);

  return { lastProcessedTranscript };
};
