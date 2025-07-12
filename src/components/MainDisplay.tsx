"use client";

import { ReactNode, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ContentCard from "./ContentCard";
import PostFeed from "./PostFeed";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "./ui/textarea";
import toast from "react-hot-toast";
import {
  createPost,
  getSubreddit,
  getPost,
  checkSubscription,
  unsubscribeFromSub,
  subscribeToSub,
  votePost,
  createComment,
  getComments,
  deleteComment,
  voteComment,
} from "@/app/action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { AspectRatio } from "./ui/aspect-ratio";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

export default function MainDisplay({
  user,
  type,
  subredditName,
  postID,
}: {
  user: any;
  type: string;
  subredditName?: string;
  postID?: string;
}) {
  const [sidebar, setSidebar] = useState(true);
  const [sub, setSub] = useState("");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [img, setImg] = useState("");
  const [contentType, setContentType] = useState(0);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    if (postID != undefined && postID != null) {
      getMainPost();
    }
  }, []);

  if (!mounted) {
    return null;
  }

  async function postButton() {
    const subRegex = /^(?!_)[A-Za-z0-9_]{3,21}$/;
    const urlRegex =
      /^(https?:\/\/)([A-Za-z0-9-]+\.)+[A-Za-z]{2,}(?::\d{1,5})?(\/[^\s]*)?$/;

    if (user.data === null) {
      toast.error("Please log in");
      router.push("/");
      return;
    }

    if (title === "") {
      toast.error("You must enter a title");
      return;
    }
    if (title.length > 100) {
      toast.error("Titles length must be less than 100 characters");
      return;
    }
    if (sub.slice(0, 2).toLowerCase() === "r/") {
      if (!subRegex.test(sub.slice(2))) {
        toast.error("Subreddit name is formatted wrong");
        return;
      }
    } else if (!subRegex.test(sub)) {
      toast.error("Subreddit name is formatted wrong");
      return;
    }

    if (contentType === 0) {
      if (text === "") {
        toast.error("Please enter description");
        return;
      }
    } else {
      if (img === "") {
        toast.error("Please enter url");
        return;
      }
      if (!urlRegex.test(img)) {
        toast.error("Image url is formatted wrong");
        return;
      }
    }

    const { data: d, error: e } = await getSubreddit(
      sub.slice(0, 2).toLowerCase() === "r/" ? sub.slice(2) : sub
    );

    if (e !== null) {
      toast.error("Couldnt find the subreddit");
      return;
    }

    const { data, error } = await createPost(
      title,
      contentType === 0 ? text : img,
      contentType,
      d,
      user
    );

    console.log(data, error);

    if (error !== null) {
      toast.error("Error:" + error.message);
    } else {
      toast.success("Post created");
      router.push("/");
    }
  }

  async function getMainPost() {
    const { data, error } = await getPost(postID ?? "");

    if (error !== null) {
      toast.error("Post couldn't found");
      console.log(error);
      return;
    }

    setPost(data);
  }

  const formatPostContent = (post: any) => {
    let content;

    try {
      // Handle both string and object content
      if (typeof post.content === "string") {
        try {
          content = JSON.parse(post.content);
        } catch {
          content = { value: post.content, type: post.content_type ? 1 : 0 };
        }
      } else {
        content = post.content;
      }
    } catch {
      content = { value: post.content, type: post.content_type ? 1 : 0 };
    }

    // Convert integer user_vote to boolean for ContentCard
    let userVote: boolean | null = null;
    if (post.user_vote === 1) {
      userVote = true; // upvote
    } else if (post.user_vote === -1) {
      userVote = false; // downvote
    }

    return {
      title: post.title,
      sub: post.subreddit_name,
      subredditId: post.subreddit_id,
      text: content.type === 0 ? content.value : undefined,
      img: content.type === 1 ? ([content.value] as [string]) : undefined,
      up: post.upvote_count,
      down: post.downvote_count,
      comment: post.comment_count,
      date: new Date(post.created_at),
      userVote: userVote,
    };
  };

  return (
    <main className="relative flex h-[calc(100vh-60px)]">
      <Sidebar open={sidebar} setOpen={setSidebar} user={user} />

      <div
        className={`
          flex-1 h-[calc(100vh-60px)] transition-[margin-left] duration-300 flex justify-center overflow-auto
          ${sidebar ? "md:ml-[250px]" : "md:ml-[25px]"} px-[10px] py-[40px]
        `}
      >
        {type === "create_post" ? (
          <>
            <div className="w-full h-full flex flex-col justify-start gap-4 px-6">
              <div className="max-w-[640px] w-full absolute">
                <button
                  onClick={() => {
                    router.push("/");
                  }}
                  className="absolute right-[0px] top-[0px] p-[4px] rounded-full cursor-pointer hover:bg-black/10"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    className="size-6"
                    stroke={theme === "dark" ? "#e3e3e3" : "#434343"}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <h1 className="text-3xl font-bold">Create Post</h1>
              <div className="flex flex-col max-w-[640px] w-full items-start gap-1">
                <Label htmlFor="sub">Subreddit</Label>
                <Input
                  onChange={(e) => {
                    setSub(e.target.value);
                  }}
                  type="text"
                  id="sub"
                  placeholder="Subreddit Name"
                  value={sub}
                />
              </div>
              <div className="flex flex-col grow max-w-[640px] w-full items-start gap-1">
                <Label htmlFor="title">Title</Label>
                <Input
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  type="text"
                  id="title"
                  placeholder="Title"
                  value={title}
                />
                <Tabs defaultValue="text" className=" w-full mt-8">
                  <TabsList>
                    <TabsTrigger onClick={() => setContentType(0)} value="text">
                      Text
                    </TabsTrigger>
                    <TabsTrigger onClick={() => setContentType(1)} value="img">
                      Images
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="text" className="mt-4">
                    <div className="flex flex-col grow w-full items-start gap-1">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        onChange={(e) => {
                          setText(e.target.value);
                          console.log(contentType);
                        }}
                        id="description"
                        placeholder="Description"
                        value={text}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="img" className="mt-4">
                    <div className="flex flex-col grow w-full items-start gap-1">
                      <Label htmlFor="img">Image</Label>
                      <Input
                        onChange={(e) => {
                          setImg(e.target.value);
                          console.log(contentType);
                        }}
                        type="url"
                        id="img"
                        placeholder="Image Url"
                        value={img}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              <div className="max-w-[640px] w-full h-[100px] flex items-center justify-center mt-auto">
                <button
                  onClick={() => {
                    postButton();
                  }}
                  className="w-full h-6/10 rounded-4xl text-white text-xl font-bold bg-orange cursor-pointer hover:brightness-90 dark:hover:brightness-75"
                >
                  Post
                </button>
              </div>
            </div>
          </>
        ) : type === "post_feed" ? (
          <PostFeed subredditName={subredditName} user={user} />
        ) : (
          post !== undefined &&
          post !== null && (
            <Post
              key={post.id}
              user={{ username: post.author_username, img: "" }}
              content={formatPostContent(post)}
              postId={post.id}
              currentUser={user}
            />
          )
        )}
      </div>
      <p></p>
    </main>
  );
}

function Post({
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
  const [score, setScore] = useState(content.up - content.down);
  const [userVote, setUserVote] = useState<boolean | null>(
    content.userVote ?? null
  );
  const [voting, setVoting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  // Sync with parent data when content changes
  useEffect(() => {
    setScore(content.up - content.down);
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

  // Load comments when component mounts
  useEffect(() => {
    const loadComments = async () => {
      if (postId) {
        const { data, error } = await getComments(postId);
        if (!error && data) {
          setComments(data);
        }
      }
    };
    loadComments();
  }, [postId]);

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

  const handleCommentSubmit = async (parentId?: string) => {
    if (!currentUser?.data?.id) {
      toast.error("Please log in to comment");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    if (!postId) {
      toast.error("Post ID not available");
      return;
    }

    setSubmittingComment(true);
    try {
      const { data, error } = await createComment(
        postId,
        newComment.trim(),
        currentUser,
        parentId
      );

      if (error) {
        toast.error("Error posting comment: " + error.message);
      } else if (data && data[0]) {
        // Add default vote properties to new comment
        const newCommentWithVotes = {
          ...data[0],
          score: 0,
          userVote: 0,
        };
        setComments((prev) => [...prev, newCommentWithVotes]);
        setNewComment("");
        toast.success("Comment posted successfully");
      }
    } catch (error) {
      toast.error("Error posting comment");
      console.error("Comment error:", error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const { error } = await deleteComment(commentId, currentUser);

      if (error) {
        toast.error("Error deleting comment: " + error.message);
      } else {
        setComments((prev) =>
          prev.filter((comment) => comment.id !== commentId)
        );
        toast.success("Comment deleted successfully");
      }
    } catch (error) {
      toast.error("Error deleting comment");
      console.error("Delete comment error:", error);
    }
  };

  // Function to organize comments into hierarchical structure
  const organizeComments = (comments: any[]) => {
    const commentMap = new Map();
    const rootComments: any[] = [];

    // First pass: create a map of all comments
    comments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: organize into hierarchy
    comments.forEach((comment) => {
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id);
        if (parent) {
          parent.replies.push(commentMap.get(comment.id));
        }
      } else {
        rootComments.push(commentMap.get(comment.id));
      }
    });

    return rootComments;
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
          setScore((prev) => prev - 1); // Remove upvote
        } else {
          setScore((prev) => prev + 1); // Remove downvote (add 1 to score)
        }
        setUserVote(null);
      } else {
        // Change or add vote
        if (userVote === true && !vote) {
          // Changed from upvote to downvote (-2 total: -1 for removing upvote, -1 for adding downvote)
          setScore((prev) => prev - 2);
        } else if (userVote === false && vote) {
          // Changed from downvote to upvote (+2 total: +1 for removing downvote, +1 for adding upvote)
          setScore((prev) => prev + 2);
        } else if (userVote === null) {
          // New vote
          if (vote) {
            setScore((prev) => prev + 1); // Add upvote
          } else {
            setScore((prev) => prev - 1); // Add downvote
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
    <article className="w-full max-w-[732px] h-min flex flex-col  rounded-2xl p-[12px]">
      <div className="flex items-center gap-[4px] mb-[8px]">
        <button
          onClick={() => {
            router.back();
          }}
          className="p-[4px] rounded-full cursor-pointer bg-light_primary dark:bg-dark_secondary hover:brightness-90"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke={theme === "dark" ? "#e3e3e3" : "#434343"}
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </button>
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
      <h1 className="text-3xl">{content.title}</h1>
      {content.img && content.img[0] ? (
        <div className="mt-4">
          <AspectRatio ratio={16 / 9}>
            <img
              src={content.img[0]}
              alt="Post image"
              className="rounded-md object-cover w-full h-full"
            />
          </AspectRatio>
        </div>
      ) : (
        <p className=" line-clamp-6 text-sm font-light">{content.text}</p>
      )}
      <div className="flex items-center gap-4 mt-4">
        <div className="h-full flex items-center px-2 py-1.5 gap-[6px] rounded-2xl bg-light_secondary dark:bg-dark_secondary text-sm">
          <button
            onClick={() => handleVote(true)}
            disabled={voting}
            className={`transition-colors ${
              userVote === true ? "text-orange-500" : "hover:text-orange-500"
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
          <span className="font-medium">{score}</span>
          <button
            onClick={() => handleVote(false)}
            disabled={voting}
            className={`transition-colors ${
              userVote === false ? "text-blue-500" : "hover:text-blue-500"
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

      {/* Comment Section */}
      <div className="mt-6 border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Comments ({comments.length})
          </h3>
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            {showComments ? "Hide" : "Show"} Comments
          </button>
        </div>

        {showComments && (
          <>
            {/* Comment Input */}
            {currentUser?.data?.id ? (
              <div className="mb-6">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="What are your thoughts?"
                  className="mb-2 resize-none"
                  rows={3}
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => handleCommentSubmit()}
                    disabled={submittingComment || !newComment.trim()}
                    className="px-4 py-2 bg-[#115bca] text-white rounded-2xl text-sm hover:brightness-125 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingComment ? "Posting..." : "Comment"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Please log in to comment
                </p>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                organizeComments(comments).map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    currentUser={currentUser}
                    onDelete={handleDeleteComment}
                    postId={postId!}
                    setComments={setComments}
                    depth={0}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </article>
  );
}

// Recursive Comment Component for nested comments
function CommentItem({
  comment,
  currentUser,
  onDelete,
  postId,
  setComments,
  depth,
}: {
  comment: any;
  currentUser: any;
  onDelete: (commentId: string) => void;
  postId: string;
  setComments: React.Dispatch<React.SetStateAction<any[]>>;
  depth: number;
}) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [score, setScore] = useState(comment.score || 0);
  const [userVote, setUserVote] = useState(comment.userVote || 0);
  const [voting, setVoting] = useState(false);

  const handleVote = async (voteType: number) => {
    if (!currentUser?.data?.id) {
      toast.error("Please log in to vote");
      return;
    }

    setVoting(true);
    try {
      const { error } = await voteComment(comment.id, voteType);
      if (error) {
        toast.error("Error voting: " + error.message);
      } else {
        // Calculate new score and user vote
        const oldVote = userVote;
        let newScore = score;
        let newUserVote = voteType;

        if (oldVote === voteType) {
          // Remove vote
          newScore -= voteType;
          newUserVote = 0;
        } else {
          // Add new vote and remove old vote
          newScore = newScore - oldVote + voteType;
        }

        setScore(newScore);
        setUserVote(newUserVote);
      }
    } catch (error) {
      toast.error("Error voting on comment");
      console.error("Vote error:", error);
    } finally {
      setVoting(false);
    }
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;

    setSubmittingReply(true);
    try {
      const { data, error } = await createComment(
        postId,
        replyText.trim(),
        currentUser,
        comment.id
      );

      if (error) {
        toast.error("Error posting reply: " + error.message);
      } else if (data && data[0]) {
        // Add default vote properties to new reply
        const newReplyWithVotes = {
          ...data[0],
          score: 0,
          userVote: 0,
        };
        // Add the new reply to the comments list
        setComments((prev: any[]) => [...prev, newReplyWithVotes]);
        setReplyText("");
        setShowReplyBox(false);
        toast.success("Reply posted successfully");
      }
    } catch (error) {
      toast.error("Error posting reply");
      console.error("Reply error:", error);
    } finally {
      setSubmittingReply(false);
    }
  };

  // Limit nesting depth to prevent excessive indentation
  const maxDepth = 6;
  const isMaxDepth = depth >= maxDepth;

  return (
    <div className={`${depth > 0 ? "ml-6 mt-3" : ""}`}>
      <div
        className={`border-l-2 ${
          depth % 2 === 0
            ? "border-gray-200 dark:border-gray-700"
            : "border-blue-200 dark:border-blue-800"
        } pl-4`}
      >
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src="" />
            <AvatarFallback className="text-xs">
              {comment.profiles?.username?.slice(0, 2).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">
            {comment.profiles?.username || "Unknown User"}
          </span>
          <span className="text-xs text-gray-500">
            {(() => {
              const [value, unit] = getTimeDiff(new Date(comment.created_at));
              return rtf.format(value, unit);
            })()}
          </span>
          <div className="ml-auto flex items-center gap-2">
            {!isMaxDepth && (
              <button
                onClick={() => setShowReplyBox(!showReplyBox)}
                className="text-xs text-blue-500 hover:text-blue-700"
              >
                Reply
              </button>
            )}
            {currentUser?.data?.id === comment.author_id && (
              <button
                onClick={() => onDelete(comment.id)}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
          {comment.content}
        </p>

        {/* Comment Voting */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleVote(1)}
              disabled={voting}
              className={`p-1 rounded transition-colors ${
                userVote === 1
                  ? "text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950"
                  : "text-gray-400 hover:text-orange-500 hover:bg-orange-500"
              } ${voting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={userVote === 1 ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M9 20v-8h-3.586a1 1 0 0 1 -.707 -1.707l6.586 -6.586a1 1 0 0 1 1.414 0l6.586 6.586a1 1 0 0 1 -.707 1.707h-3.586v8a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
              </svg>
            </button>
            <span
              className={`text-xs font-medium min-w-[20px] text-center ${
                userVote === 1
                  ? "text-orange-500"
                  : userVote === -1
                  ? "text-blue-500"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {score}
            </span>
            <button
              onClick={() => handleVote(-1)}
              disabled={voting}
              className={`p-1 rounded transition-colors ${
                userVote === -1
                  ? "text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950"
                  : "text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950"
              } ${voting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={userVote === -1 ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M15 4v8h3.586a1 1 0 0 1 .707 1.707l-6.586 6.586a1 1 0 0 1 -1.414 0l-6.586 -6.586a1 1 0 0 1 .707 -1.707h3.586v-8a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Reply Box */}
        {showReplyBox && (
          <div className="mt-3 mb-3">
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="mb-2 resize-none text-sm"
              rows={2}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowReplyBox(false)}
                className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleReplySubmit}
                disabled={submittingReply || !replyText.trim()}
                className="px-3 py-1 bg-[#115bca] text-white rounded text-xs hover:brightness-125 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingReply ? "Posting..." : "Reply"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map((reply: any) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUser={currentUser}
              onDelete={onDelete}
              postId={postId}
              setComments={setComments}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
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
