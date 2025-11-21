import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThumbsUp, Download, Eye, MessageSquare, Clock } from "lucide-react";
import { createDownloadLink } from "@/utils/helpers";

interface EndStageProps {
  viewerCount: number;
  commentCount: number;
  duration: number;
  downloadUrl: string | null;
  onReturnToStudio: () => void;
}

export const EndStage: React.FC<EndStageProps> = ({
  viewerCount,
  commentCount,
  duration,
  downloadUrl,
  onReturnToStudio,
}) => {
  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  const handleDownload = () => {
    if (downloadUrl) {
      const extension = downloadUrl.includes('webm') ? 'webm' : 'mp4';
      createDownloadLink(downloadUrl, `stream-recording-${Date.now()}.${extension}`);
    }
  };

  return (
    <div className="absolute inset-0 bg-[#09090b] z-50 flex flex-col items-center justify-center p-4 sm:p-8 animate-in zoom-in duration-300">
      <Card className="bg-[#18181b] p-6 sm:p-10 rounded-3xl border-white/10 w-full max-w-lg text-center shadow-2xl space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-24 h-24 bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 rounded-full flex items-center justify-center ring-2 ring-white/10 shadow-lg">
            <ThumbsUp size={40} className="text-white" />
          </div>
        </div>

        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-bold text-white tracking-tight">
            Stream Complete!
          </CardTitle>
          <CardDescription className="text-base text-zinc-400">
            Great session! Here&apos;s your performance summary.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all group">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center group-hover:bg-zinc-700/50 transition-colors">
                  <Eye size={18} className="text-zinc-300" />
                </div>
                <div className="text-2xl font-bold text-white tabular-nums">
                  {viewerCount + 53}
                </div>
                <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
                  Views
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all group">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center group-hover:bg-zinc-700/50 transition-colors">
                  <MessageSquare size={18} className="text-zinc-300" />
                </div>
                <div className="text-2xl font-bold text-white tabular-nums">
                  {commentCount}
                </div>
                <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
                  Messages
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all group">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 rounded-lg bg-zinc-800/50 flex items-center justify-center group-hover:bg-zinc-700/50 transition-colors">
                  <Clock size={18} className="text-zinc-300" />
                </div>
                <div className="text-xl font-bold font-mono text-white tabular-nums">
                  {formatDuration(duration)}
                </div>
                <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
                  Duration
                </div>
              </div>
            </div>
          </div>

          {downloadUrl ? (
            <Button
              onClick={handleDownload}
              variant="default"
              className="w-full mt-2 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-semibold text-base shadow-lg shadow-red-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download size={20} className="mr-2" />
              <span>Download Recording</span>
            </Button>
          ) : (
            <div className="w-full mt-2 py-4 bg-zinc-900/50 rounded-xl flex items-center justify-center space-x-3 text-zinc-300 border border-white/5">
              <div className="w-5 h-5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium">
                Processing Recording...
              </span>
            </div>
          )}

          <Button
            onClick={onReturnToStudio}
            variant="ghost"
            className="w-full mt-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-xl py-3 transition-all"
          >
            Return to Studio
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

