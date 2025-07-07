import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import img1 from "@public/image.png";

export default function ContentCard({
  user,
  content,
}: {
  user: { username: string; img: string };
  content: {
    title: string;
    sub: string;
    text?: string;
    img?: [string];
    up: number;
    down: number;
    comment: number;
    date: Date;
  };
}) {
  return (
    <article className="w-full max-w-[732px] h-min flex flex-col  rounded-2xl p-[12px] hover:bg-black/5 dark:hover:bg-white/10">
      <div className="flex items-center gap-[4px] mb-[8px]">
        <Avatar>
          <AvatarImage src={""} />
          <AvatarFallback>{content.sub.toString().slice(0, 2)}</AvatarFallback>
        </Avatar>
        <p className="text-gray-500">r/{content.sub}</p>
        <p className="text-gray-500 ml-[4px]">
          •
          {(() => {
            const [value, unit] = getTimeDiff(content.date);
            return rtf.format(value, unit);
          })()}
        </p>
        <button className="h-full bg-[#115bca] text-white ml-auto px-4 py-1 rounded-2xl text-sm hover:brightness-125">
          Join
        </button>
      </div>
      <h1 className="text-3xl">{content.title}</h1>
      {content.img ? (
        <AspectRatio ratio={16 / 9}>
          <Image src={img1} alt="Image" className="rounded-md object-cover" />
        </AspectRatio>
      ) : (
        <p className=" line-clamp-6 text-sm font-light">{content.text}</p>
      )}
      <div className="flex items-center gap-4 mt-4">
        <div className="h-full flex items-center px-2 py-1.5 gap-[6px] rounded-2xl bg-light_secondary dark:bg-dark_secondary text-sm">
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none" // use fill white to display if the post is upvoted
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-[20px] hover:stroke-orange"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M9 20v-8h-3.586a1 1 0 0 1 -.707 -1.707l6.586 -6.586a1 1 0 0 1 1.414 0l6.586 6.586a1 1 0 0 1 -.707 1.707h-3.586v8a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
            </svg>
          </button>
          {content.up - content.down}
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none" // use fill to display if the post is downvoted
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-[20px] hover:stroke-blue"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M15 4v8h3.586a1 1 0 0 1 .707 1.707l-6.586 6.586a1 1 0 0 1 -1.414 0l-6.586 -6.586a1 1 0 0 1 .707 -1.707h3.586v-8a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1z" />
            </svg>
          </button>
        </div>
        <button className="h-full flex items-center px-2 py-1.5 gap-[4px] rounded-2xl bg-light_secondary dark:bg-dark_secondary text-sm hover:brightness-90 dark:hover:brightness-125">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="size-[20px]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
            />
          </svg>
          {content.comment}
        </button>
        <button className="h-full flex items-center px-2 py-1.5 gap-[4px] rounded-2xl bg-light_secondary dark:bg-dark_secondary text-sm hover:brightness-90 dark:hover:brightness-125">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-[20px]"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M13 4v4c-6.575 1.028 -9.02 6.788 -10 12c-.037 .206 5.384 -5.962 10 -6v4l8 -7l-8 -7z" />
          </svg>
          Share
        </button>
      </div>
    </article>
  );
}

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
function getTimeDiff(date: Date) {
  const now = Date.now();
  const diff = date.getTime() - now;

  const minutes = 60_000;
  const hours = 60 * minutes;
  const days = 24 * hours;
  const weeks = 7 * days;
  const months = 30 * days;
  const years = 365 * days;

  if (Math.abs(diff) >= years) {
    return [Math.round(diff / years), "year"] as const;
  }
  if (Math.abs(diff) >= months) {
    return [Math.round(diff / months), "month"] as const;
  }
  if (Math.abs(diff) >= weeks) {
    return [Math.round(diff / weeks), "week"] as const;
  }
  if (Math.abs(diff) >= days) {
    return [Math.round(diff / days), "day"] as const;
  }
  if (Math.abs(diff) >= hours) {
    return [Math.round(diff / hours), "hour"] as const;
  }
  if (Math.abs(diff) >= minutes) {
    return [Math.round(diff / minutes), "minute"] as const;
  }
  return [Math.round(diff / 1000), "second"] as const;
}
