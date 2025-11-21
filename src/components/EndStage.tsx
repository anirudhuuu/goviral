import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThumbsUp, Download } from "lucide-react";
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
    <div className="absolute inset-0 bg-[#09090b] z-50 flex flex-col items-center justify-center p-8 animate-in zoom-in duration-300">
      <Card className="bg-[#18181b] p-8 rounded-3xl border-white/10 w-full max-w-sm text-center shadow-2xl space-y-8">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center ring-1 ring-green-500/20">
            <ThumbsUp size={36} className="text-green-500" />
          </div>
        </div>

        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">
            Stream Summary
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Nice work! Here&apos;s how you did.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-3 gap-4 bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
            <div className="text-center">
              <div className="text-xl font-bold text-white">
                {viewerCount + 53}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                Total Views
              </div>
            </div>
            <div className="text-center border-l border-white/5">
              <div className="text-xl font-bold text-white">
                {commentCount}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                Messages
              </div>
            </div>
            <div className="text-center border-l border-white/5">
              <div className="text-lg font-bold font-mono text-white tabular-nums">
                {formatDuration(duration)}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                Duration
              </div>
            </div>
          </div>

          {downloadUrl ? (
            <Button
              onClick={handleDownload}
              variant="default"
              className="w-full mt-6 py-3.5 bg-white hover:bg-zinc-200 text-black rounded-xl font-bold"
            >
              <Download size={18} className="mr-2" />
              <span>Download Video</span>
            </Button>
          ) : (
            <div className="w-full mt-6 py-3.5 bg-zinc-800 rounded-xl flex items-center justify-center space-x-2 text-zinc-400 cursor-wait">
              <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium">
                Processing Recording...
              </span>
            </div>
          )}

          <Button
            onClick={onReturnToStudio}
            variant="ghost"
            className="mt-4 text-xs font-medium text-zinc-500 hover:text-zinc-300 uppercase tracking-wide"
          >
            Return to Studio
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

