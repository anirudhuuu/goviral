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

export const limitComments = (
  comments: Comment[],
  maxCount: number
): Comment[] => {
  if (comments.length > maxCount) {
    return comments.slice(comments.length - maxCount);
  }
  return comments;
};

export const generateRandomViewerChange = (
  maxChange: number,
  variance: number
): number => {
  return Math.floor(Math.random() * maxChange) - variance;
};

export const createDownloadLink = (url: string, filename: string): void => {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
};

export const getContainerClassName = (
  orientation: "vertical" | "horizontal"
): string => {
  return orientation === "vertical"
    ? "w-full h-full lg:w-[375px] lg:h-[min(calc(100vh-2rem),812px)] lg:mx-auto lg:my-auto aspect-[9/16] lg:aspect-[9/16] rounded-xl lg:rounded-2xl overflow-hidden"
    : "w-full h-full lg:w-full lg:h-screen max-w-[98vw] lg:max-w-none max-h-[96vh] lg:max-h-none aspect-video lg:aspect-auto rounded-lg lg:rounded-none";
};
