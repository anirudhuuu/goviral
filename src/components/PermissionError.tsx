import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Mic, AlertCircle } from "lucide-react";

interface PermissionErrorProps {
  onRetry: () => void;
}

export const PermissionError: React.FC<PermissionErrorProps> = ({
  onRetry,
}) => {
  return (
    <div className="fixed inset-0 bg-[#09090b] z-50 flex items-center justify-center p-4">
      <Card className="bg-[#18181b] border-yellow-500/20 max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-500">
            <AlertCircle size={24} />
            Camera & Microphone Access Required
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-zinc-400">
            GoViral needs access to your camera and microphone to start
            streaming. Please allow access when prompted by your browser.
          </p>

          <div className="bg-zinc-900/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Camera size={20} className="text-zinc-400" />
              <span className="text-sm text-zinc-300">Camera access</span>
            </div>
            <div className="flex items-center gap-3">
              <Mic size={20} className="text-zinc-400" />
              <span className="text-sm text-zinc-300">Microphone access</span>
            </div>
          </div>

          <Button
            onClick={onRetry}
            className="w-full bg-yellow-600 hover:bg-yellow-700"
          >
            Grant Permissions
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
