import React, { useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Smile, Send } from "lucide-react";
import { StreamOrientation } from "@/types";
import { COMMENT_CONFIG } from "@/constants";

interface ChatInputProps {
  messageInput: string;
  showEmojiPicker: boolean;
  orientation: StreamOrientation;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onToggleEmojiPicker: () => void;
  onEmojiSelect: (emoji: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  messageInput,
  showEmojiPicker,
  orientation,
  onMessageChange,
  onSendMessage,
  onToggleEmojiPicker,
  onEmojiSelect,
}) => {
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        onToggleEmojiPicker();
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showEmojiPicker, onToggleEmojiPicker]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const isVertical = orientation === "vertical";
  const remainingChars = COMMENT_CONFIG.MAX_MESSAGE_LENGTH - messageInput.length;
  const showCharCount = messageInput.length > COMMENT_CONFIG.MAX_MESSAGE_LENGTH * 0.8;

  return (
    <div className="relative">
      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          className="absolute bottom-full left-0 mb-2 z-50"
        >
          <EmojiPicker
            onEmojiClick={(emojiData) => onEmojiSelect(emojiData.emoji)}
            // @ts-expect-error - EmojiPicker theme prop type issue
            theme="dark"
            width={isVertical ? 280 : 320}
            height={isVertical ? 350 : 400}
          />
        </div>
      )}
      <div className="space-y-1">
        <div
          className={`flex items-center space-x-2 ${
            isVertical
              ? "bg-white/10 backdrop-blur-lg rounded-full px-4 py-2 border border-white/5"
              : "bg-zinc-800/60 rounded-lg px-3 py-2.5 border border-zinc-700/50 hover:bg-zinc-800/80 transition-colors"
          }`}
        >
          <Input
            type="text"
            placeholder={isVertical ? "Add a comment..." : "Send a message..."}
            value={messageInput}
            onChange={(e) => {
              if (e.target.value.length <= COMMENT_CONFIG.MAX_MESSAGE_LENGTH) {
                onMessageChange(e.target.value);
              }
            }}
            onKeyDown={handleKeyDown}
            aria-label="Chat message input"
            maxLength={COMMENT_CONFIG.MAX_MESSAGE_LENGTH}
            className={`bg-transparent border-none outline-none text-sm text-white flex-1 h-auto p-0 focus-visible:ring-0 ${
              isVertical ? "placeholder:text-white/30" : "placeholder:text-zinc-500"
            }`}
          />
        <Button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleEmojiPicker();
          }}
          variant="ghost"
          size="icon"
          className={`transition-colors shrink-0 h-8 w-8 ${
            isVertical
              ? "text-white/50 hover:text-white"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
          aria-label="Add emoji"
          title="Add emoji"
        >
          <Smile size={isVertical ? 18 : 20} />
        </Button>
        <Button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSendMessage();
          }}
          variant="ghost"
          size="icon"
          className={`transition-colors shrink-0 h-8 w-8 ${
            messageInput.trim()
              ? isVertical
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-500 hover:text-blue-400"
              : isVertical
              ? "text-white/30"
              : "text-zinc-600"
          }`}
          disabled={!messageInput.trim()}
          title="Send message"
        >
          <Send size={isVertical ? 18 : 20} />
        </Button>
      </div>
      {showCharCount && (
        <div
          className={`text-xs text-right ${
            remainingChars < 20
              ? "text-red-400"
              : remainingChars < 50
              ? "text-amber-400"
              : isVertical
              ? "text-white/40"
              : "text-zinc-500"
          }`}
        >
          {remainingChars} characters left
        </div>
      )}
      </div>
    </div>
  );
};

