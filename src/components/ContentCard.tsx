import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  votePost,
  subscribeToSub,
  unsubscribeFromSub,
  checkSubscription,
} from "@/app/action";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ContentCard({
  user,
  content,
  postId,
  currentUser,
}: {
  user: { username: string; img: string };
  content: {
    title: string;
    sub: string;
    subredditId?: string;
    text?: string;
    img?: [string];
    up: number;
    down: number;
    comment: number;
    date: Date;
    userVote?: boolean | null;
  };
  postId?: string;
  currentUser?: any;
}) {
  const [upvotes, setUpvotes] = useState(content.up);
  const [downvotes, setDownvotes] = useState(content.down);
  const [userVote, setUserVote] = useState<boolean | null>(
    content.userVote ?? null
  );
  const [voting, setVoting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const router = useRouter();

  // Calculate total score (upvotes - downvotes)
  const totalScore = upvotes - downvotes;

  // Sync with parent data when content changes
  useEffect(() => {
    setUpvotes(content.up);
    setDownvotes(content.down);
    setUserVote(content.userVote ?? null);
  }, [content.up, content.down, content.userVote]);

  // Check subscription status when component mounts
  useEffect(() => {
    const checkSubStatus = async () => {
      if (content.subredditId && currentUser?.data?.id) {
        const { isSubscribed } = await checkSubscription(
          content.subredditId,
          currentUser
        );
        setIsSubscribed(isSubscribed);
      }
    };
    checkSubStatus();
  }, [content.subredditId, currentUser]);

  const handleSubscription = async () => {
    if (!currentUser?.data?.id) {
      toast.error("Please log in to subscribe");
      return;
    }

    if (!content.subredditId) {
      toast.error("Subreddit ID not available");
      return;
    }

    if (subscribing) return;

    setSubscribing(true);
    try {
      let result;
      if (isSubscribed) {
        result = await unsubscribeFromSub(content.subredditId, currentUser);
        if (!result.error) {
          setIsSubscribed(false);
          toast.success("Unsubscribed successfully");
        }
      } else {
        result = await subscribeToSub(content.subredditId, currentUser);
        if (!result.error) {
          setIsSubscribed(true);
          toast.success("Subscribed successfully");
        }
      }

      if (result.error) {
        toast.error("Error: " + result.error.message);
      }
    } catch (error) {
      toast.error("Error managing subscription");
      console.error("Subscription error:", error);
    } finally {
      setSubscribing(false);
    }
  };

  const handleShare = async () => {
    if (!postId) {
      toast.error("Post ID not available");
      return;
    }

    try {
      const postUrl = `${window.location.origin}/post/${postId}`;
      await navigator.clipboard.writeText(postUrl);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      // Fallback for older browsers or when clipboard API is not available
      try {
        const textArea = document.createElement("textarea");
        textArea.value = `${window.location.origin}/post/${postId}`;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        toast.success("Link copied to clipboard!");
      } catch (fallbackError) {
        toast.error("Failed to copy link to clipboard");
        console.error("Clipboard error:", error, fallbackError);
      }
    }
  };

  const handleVote = async (vote: boolean) => {
    if (!currentUser?.data?.id) {
      toast.error("Please log in to vote");
      return;
    }

    if (!postId || voting) return;

    setVoting(true);
    console.log("CLIENT: About to call votePost with:", {
      postId,
      vote,
      currentUser,
    });
    try {
      const { error } = await votePost(postId, vote, currentUser);
      console.log("CLIENT: votePost returned:", { error });

      if (error) {
        toast.error("Error voting: " + error.message);
        return;
      }

      // Update local state optimistically
      if (userVote === vote) {
        // Remove vote - clicking the same vote again removes it
        if (vote) {
          setUpvotes((prev) => prev - 1);
        } else {
          setDownvotes((prev) => prev - 1);
        }
        setUserVote(null);
      } else {
        // Change or add vote
        if (userVote === true && !vote) {
          // Changed from upvote to downvote
          setUpvotes((prev) => prev - 1);
          setDownvotes((prev) => prev + 1);
        } else if (userVote === false && vote) {
          // Changed from downvote to upvote
          setDownvotes((prev) => prev - 1);
          setUpvotes((prev) => prev + 1);
        } else if (userVote === null) {
          // New vote
          if (vote) {
            setUpvotes((prev) => prev + 1);
          } else {
            setDownvotes((prev) => prev + 1);
          }
        }
        setUserVote(vote);
      }
    } catch (error) {
      toast.error("Error voting");
      console.error("Vote error:", error);
    } finally {
      setVoting(false);
    }
  };
  return (
    <article className="w-full max-w-[732px] h-min flex flex-col  rounded-2xl p-[12px] hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer">
      <div className="flex items-center gap-[4px] mb-[8px]">
        <Avatar>
          <AvatarImage src={""} />
          <AvatarFallback>{content.sub.toString().slice(0, 2)}</AvatarFallback>
        </Avatar>
        <Link
          href={`/r/${content.sub}`}
          className="text-gray-500 hover:underline"
        >
          r/{content.sub}
        </Link>
        <p className="text-gray-500 ml-[4px]">
          •
          {(() => {
            const [value, unit] = getTimeDiff(content.date);
            return rtf.format(value, unit);
          })()}
        </p>
        <button
          onClick={handleSubscription}
          disabled={subscribing}
          className={`h-full ml-auto px-4 py-1 rounded-2xl text-sm transition-all ${
            isSubscribed
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              : "bg-[#115bca] text-white hover:brightness-125"
          } ${subscribing ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {subscribing ? "..." : isSubscribed ? "Joined" : "Join"}
        </button>
      </div>
      <h1
        className="text-3xl"
        onClick={() => {
          router.push("/post/" + postId);
        }}
      >
        {content.title}
      </h1>
      {content.img && content.img[0] ? (
        <div
          className="mt-4"
          onClick={() => {
            router.push("/post/" + postId);
          }}
        >
          <AspectRatio ratio={16 / 9}>
            <img
              src={content.img[0]}
              alt="Post image"
              className="rounded-md object-cover w-full h-full"
            />
          </AspectRatio>
        </div>
      ) : (
        <p
          className=" line-clamp-6 text-sm font-light"
          onClick={() => {
            router.push("/post/" + postId);
          }}
        >
          {content.text}
        </p>
      )}
      <div className="flex items-center gap-4 mt-4">
        <div className="h-full flex items-center px-2 py-1.5 gap-[6px] rounded-2xl bg-light_secondary dark:bg-dark_secondary text-sm">
          <button
            onClick={() => handleVote(true)}
            disabled={voting}
            className={`transition-colors ${
              userVote === true ? "text-orange" : "hover:text-orange"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={userVote === true ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-[20px]"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M9 20v-8h-3.586a1 1 0 0 1 -.707 -1.707l6.586 -6.586a1 1 0 0 1 1.414 0l6.586 6.586a1 1 0 0 1 -.707 1.707h-3.586v8a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
            </svg>
          </button>
          <span className="font-medium">{totalScore}</span>
          <button
            onClick={() => handleVote(false)}
            disabled={voting}
            className={`transition-colors ${
              userVote === false ? "text-blue" : "hover:text-blue"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={userVote === false ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-[20px]"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M15 4v8h3.586a1 1 0 0 1 .707 1.707l-6.586 6.586a1 1 0 0 1 -1.414 0l-6.586 -6.586a1 1 0 0 1 .707 -1.707h3.586v-8a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1z" />
            </svg>
          </button>
        </div>
        <button
          onClick={() => {
            router.push("/post/" + postId);
          }}
          className="h-full flex items-center px-2 py-1.5 gap-[4px] rounded-2xl bg-light_secondary dark:bg-dark_secondary text-sm hover:brightness-90 dark:hover:brightness-125"
        >
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
        <button
          onClick={handleShare}
          className="h-full flex items-center px-2 py-1.5 gap-[4px] rounded-2xl bg-light_secondary dark:bg-dark_secondary text-sm hover:brightness-90 dark:hover:brightness-125"
        >
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
