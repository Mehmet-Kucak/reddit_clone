"use client";

import { useState, useEffect, useCallback } from "react";
import { getPostFeed } from "@/app/action";
import ContentCard from "./ContentCard";

interface Post {
  id: string;
  title: string;
  content: any;
  content_type: boolean;
  created_at: string;
  updated_at: string;
  author_username: string;
  subreddit_name: string;
  subreddit_title: string;
  subreddit_description: string;
  subreddit_id: string; // Added subreddit_id
  upvote_count: number;
  downvote_count: number;
  user_vote: number | null; // Now an integer: 1 for upvote, -1 for downvote, null for no vote
  comment_count: number;
}

interface PostFeedProps {
  subredditName?: string;
  user: any;
}

export default function PostFeed({ subredditName, user }: PostFeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);

  const POSTS_PER_PAGE = 10;

  const loadPosts = useCallback(
    async (pageNum: number, isInitial = false) => {
      if (loading) return;

      setLoading(true);

      try {
        const { data, error } = await getPostFeed(
          subredditName,
          pageNum,
          POSTS_PER_PAGE
        );

        if (error) {
          console.error("Error loading posts:", error);
          return;
        }

        if (data && data.length > 0) {
          if (isInitial) {
            setPosts(data);
          } else {
            setPosts((prev) => [...prev, ...data]);
          }

          // If we got fewer posts than requested, we've reached the end
          if (data.length < POSTS_PER_PAGE) {
            setHasMore(false);
          }
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error loading posts:", error);
      } finally {
        setLoading(false);
        if (isInitial) {
          setInitialLoad(false);
        }
      }
    },
    [subredditName, loading]
  );

  const refreshPosts = useCallback(async () => {
    setPosts([]);
    setPage(0);
    setHasMore(true);
    await loadPosts(0, true);
  }, [loadPosts]);

  // Load initial posts
  useEffect(() => {
    setPosts([]);
    setPage(0);
    setHasMore(true);
    setInitialLoad(true);
    loadPosts(0, true);
  }, [subredditName]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 1000 && // Load more when 1000px from bottom
        hasMore &&
        !loading &&
        !initialLoad
      ) {
        const nextPage = page + 1;
        setPage(nextPage);
        loadPosts(nextPage);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading, page, loadPosts, initialLoad]);

  const formatPostContent = (post: Post) => {
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

  if (initialLoad) {
    return (
      <div className="w-full max-w-[732px] flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[732px] flex flex-col gap-4">
      {posts.map((post) => (
        <ContentCard
          key={post.id}
          user={{ username: post.author_username, img: "" }}
          content={formatPostContent(post)}
          postId={post.id}
          currentUser={user}
        />
      ))}

      {loading && (
        <div className="w-full flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="w-full text-center py-4 text-gray-500">
          No more posts to load
        </div>
      )}

      {!hasMore && posts.length === 0 && (
        <div className="w-full text-center py-8 text-gray-500">
          No posts found
        </div>
      )}
    </div>
  );
}
