import { useState, useEffect, useRef } from "react";
import { StreamStage } from "@/types";
import { VIEWER_COUNT_CONFIG } from "@/constants";
import { generateRandomViewerChange } from "@/utils/helpers";

export const useViewerCount = (stage: StreamStage): number => {
  const [viewerCount, setViewerCount] = useState(0);
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    if (stage !== "live") return;

    const countInterval = setInterval(() => {
      // Only update state if component is still mounted
      if (!isMountedRef.current) return;
      
      setViewerCount((prev) => {
        const change = generateRandomViewerChange(
          VIEWER_COUNT_CONFIG.MAX_CHANGE,
          VIEWER_COUNT_CONFIG.VARIANCE
        );
        return Math.max(VIEWER_COUNT_CONFIG.MIN_COUNT, prev + change);
      });
    }, VIEWER_COUNT_CONFIG.UPDATE_INTERVAL);

    return () => {
      isMountedRef.current = false;
      clearInterval(countInterval);
    };
  }, [stage]);

  return viewerCount;
};

