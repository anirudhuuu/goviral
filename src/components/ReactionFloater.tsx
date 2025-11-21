import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { EMOJI_REACTIONS } from "@/constants";
import { StreamOrientation } from "@/types";

interface ReactionFloaterProps {
  type: string;
  id: number;
  onComplete: (id: number) => void;
  orientation: StreamOrientation;
}

export const ReactionFloater: React.FC<ReactionFloaterProps> = ({
  type,
  id,
  onComplete,
  orientation,
}) => {
  const randomX = useMemo(() => (id % 60) - 30, [id]);
  const startX = orientation === "vertical" ? 0 : 20;

  return (
    <motion.div
      initial={{ opacity: 0, y: 0, scale: 0.5, x: startX, rotate: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: -300,
        scale: [0.5, 1.2, 1],
        x: startX + randomX,
        rotate: [0, -10, 10, 0],
      }}
      transition={{ duration: 2.5, ease: "easeOut" }}
      onAnimationComplete={() => onComplete(id)}
      className={`absolute pointer-events-none z-50 select-none text-4xl drop-shadow-lg
        ${
          orientation === "vertical"
            ? "bottom-24 right-6"
            : "bottom-20 right-12"
        }
      `}
    >
      {EMOJI_REACTIONS[type as keyof typeof EMOJI_REACTIONS] || "❤️"}
    </motion.div>
  );
};

