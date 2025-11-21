import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, MessageSquare, Zap, Award, X, GripVertical } from "lucide-react";

interface PracticeModeProps {
  wordsPerMinute: number;
  fillerWordsCount: number;
  totalWords: number;
  confidenceScore: number;
  isVisible: boolean;
  onClose: () => void;
}

export const PracticeMode: React.FC<PracticeModeProps> = ({
  wordsPerMinute,
  fillerWordsCount,
  totalWords,
  confidenceScore,
  isVisible,
  onClose,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setPosition({ x: window.innerWidth - rect.width - 16, y: 80 });
    }
  }, [isVisible]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  if (!isVisible) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getWPMFeedback = (wpm: number) => {
    if (wpm < 100) return "Speak a bit faster";
    if (wpm > 180) return "Slow down slightly";
    return "Great pace!";
  };

  return (
    <Card
      ref={cardRef}
      className="fixed w-72 bg-black/90 backdrop-blur-xl border-white/10 text-white z-[100] shadow-2xl cursor-move"
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
    >
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm flex items-center gap-2">
          <GripVertical size={14} className="text-zinc-500" />
          <Award size={16} className="text-blue-400" />
          Practice Stats
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 hover:bg-white/10"
          onClick={onClose}
        >
          <X size={14} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-zinc-400">Confidence Score</span>
            <span className={`text-lg font-bold ${getScoreColor(confidenceScore)}`}>
              {confidenceScore}%
            </span>
          </div>
          <Progress value={confidenceScore} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-zinc-400" />
              <span className="text-xs text-zinc-400">Words/Min</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{wordsPerMinute}</span>
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-zinc-700">
                {getWPMFeedback(wordsPerMinute)}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare size={14} className="text-zinc-400" />
              <span className="text-xs text-zinc-400">Total Words</span>
            </div>
            <span className="text-sm font-semibold">{totalWords}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-zinc-400" />
              <span className="text-xs text-zinc-400">Filler Words</span>
            </div>
            <span className={`text-sm font-semibold ${fillerWordsCount > 5 ? 'text-red-400' : 'text-green-400'}`}>
              {fillerWordsCount}
            </span>
          </div>
        </div>

        {fillerWordsCount > 5 && (
          <div className="text-[10px] text-zinc-500 bg-zinc-900/50 p-2 rounded">
            💡 Tip: Reduce "um", "uh", "like" usage
          </div>
        )}
      </CardContent>
    </Card>
  );
};

