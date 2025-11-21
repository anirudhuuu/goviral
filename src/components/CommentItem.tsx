import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PROFILE_COLORS } from "@/constants";
import { Comment, StreamOrientation } from "@/types";
import { motion } from "framer-motion";
import { Pin, PinOff } from "lucide-react";
import React, { useMemo } from "react";

interface CommentItemProps {
  comment: Comment;
  orientation: StreamOrientation;
  onPin?: (commentId: number) => void;
  onUnpin?: (commentId: number) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  orientation,
  onPin,
  onUnpin,
}) => {
  const color = useMemo(
    () => PROFILE_COLORS[comment.id % PROFILE_COLORS.length],
    [comment.id]
  );

  if (comment.isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-2 px-2 w-full flex justify-center"
      >
        <span className="text-white/80 text-[10px] uppercase tracking-wide font-semibold bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5">
          {comment.text}
        </span>
      </motion.div>
    );
  }

  if (orientation === "vertical") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        className={`flex items-start space-x-2 mb-3 max-w-[90%] group ${
          comment.isPinned
            ? "bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-lg p-2"
            : ""
        }`}
      >
        <div
          className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold shrink-0 border border-white/10 shadow-sm`}
        >
          {comment.user[0]}
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-white text-xs font-bold drop-shadow-md leading-none">
              {comment.user}
            </span>
            {comment.isPinned && (
              <Pin size={10} className="text-blue-400" fill="currentColor" />
            )}
          </div>
          <span className="text-white/90 text-sm leading-tight drop-shadow-md">
            {comment.text}
          </span>
        </div>
        {!comment.isSystem && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 h-6 w-6 shrink-0 bg-black/60 hover:bg-black/80"
                  onClick={() =>
                    comment.isPinned
                      ? onUnpin?.(comment.id)
                      : onPin?.(comment.id)
                  }
                >
                  {comment.isPinned ? (
                    <PinOff size={12} className="text-blue-400" />
                  ) : (
                    <Pin size={12} />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{comment.isPinned ? "Unpin" : "Pin"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-start space-x-3 mb-3 p-2 hover:bg-white/5 rounded-lg transition-colors group ${
        comment.isPinned ? "bg-blue-500/10 border border-blue-500/20" : ""
      }`}
    >
      <div
        className={`w-7 h-7 rounded-full ${color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}
      >
        {comment.user[0]}
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-baseline space-x-2">
          <span className="text-gray-400 text-xs font-medium truncate">
            {comment.user}
          </span>
          {comment.isPinned && (
            <Pin size={10} className="text-blue-400" fill="currentColor" />
          )}
          <span className="text-gray-600 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
            Just now
          </span>
        </div>
        <span className="text-gray-200 text-sm leading-snug wrap-break-word">
          {comment.text}
        </span>
      </div>
      {!comment.isSystem && orientation === "horizontal" && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 h-6 w-6 shrink-0"
                onClick={() =>
                  comment.isPinned ? onUnpin?.(comment.id) : onPin?.(comment.id)
                }
              >
                {comment.isPinned ? (
                  <PinOff size={12} className="text-blue-400" />
                ) : (
                  <Pin size={12} />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{comment.isPinned ? "Unpin" : "Pin"} comment</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </motion.div>
  );
};
