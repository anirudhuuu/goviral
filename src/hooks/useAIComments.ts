import { useEffect, useState, useCallback } from "react";
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

  const processTranscript = useCallback(async () => {
    const bufferLength = transcriptBuffer.length;
    const lastLength = lastProcessedTranscript.length;

    if (bufferLength - lastLength > SPEECH_CONFIG.BUFFER_THRESHOLD) {
      const newText = transcriptBuffer.substring(lastLength);
      setLastProcessedTranscript(transcriptBuffer);

      const aiData = await aiService.generateResponse(
        newText,
        lastProcessedTranscript,
        streamTopic
      );

      if (aiData && aiData.comments) {
        const baseDelay = Math.random() * 2000 + 1000;
        aiData.comments.forEach(
          (c: { user?: string; text: string }, i: number) => {
            const jitter = Math.random() * 1500;
            setTimeout(() => {
              onAddComment(createComment(c.user || "Guest", c.text, false));
            }, baseDelay + i * COMMENT_CONFIG.ANIMATION_DELAY + jitter);
          }
        );

        if (aiData.dominantReaction) {
          const reactionDelay = Math.random() * 2000 + 1500;
          setTimeout(() => onTriggerReaction(aiData.dominantReaction), reactionDelay);
        }
      }
    }
  }, [transcriptBuffer, lastProcessedTranscript, streamTopic, onAddComment, onTriggerReaction]);

  useEffect(() => {
    if (stage !== "live") return;

    const interval = setInterval(processTranscript, SPEECH_CONFIG.CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [stage, processTranscript]);

  return { lastProcessedTranscript };
};

