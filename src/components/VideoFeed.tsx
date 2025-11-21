import React, { useRef, useEffect } from "react";

interface VideoFeedProps {
  stream: MediaStream | null;
  filterClass: string;
}

export const VideoFeed = React.memo<VideoFeedProps>(
  ({ stream, filterClass }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
      }
    }, [stream]);

    return (
      <video
        ref={videoRef}
        autoPlay
        muted={true}
        playsInline
        className={`w-full h-full object-cover transition-all duration-500 ${filterClass}`}
      />
    );
  }
);

VideoFeed.displayName = "VideoFeed";

