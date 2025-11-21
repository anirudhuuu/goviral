import { Comment } from "@/types";

export const createComment = (
  user: string,
  text: string,
  isSystem = false
): Comment => ({
  id: Date.now(),
  user,
  text,
  isSystem,
});

export const limitComments = (comments: Comment[], maxCount: number): Comment[] => {
  if (comments.length > maxCount) {
    return comments.slice(comments.length - maxCount);
  }
  return comments;
};

export const generateRandomViewerChange = (maxChange: number, variance: number): number => {
  return Math.floor(Math.random() * maxChange) - variance;
};

export const createDownloadLink = (url: string, filename: string): void => {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
};

export const getContainerClassName = (orientation: "vertical" | "horizontal"): string => {
  return orientation === "vertical"
    ? "w-full max-w-[420px] h-[850px] max-h-[95vh] aspect-[9/16] rounded-[2.5rem]"
    : "w-full h-full max-w-[98vw] max-h-[96vh] aspect-video rounded-lg";
};

