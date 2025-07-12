"use server";

import { createClient } from "@/utils/supabase/server";

export async function login(email: string, password: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  await console.log(error);

  return error;
}

export async function signup(
  email: string,
  username: string,
  password: string
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: signUpError,
  } = await supabase.auth.signUp({ email, password });
  if (signUpError !== null || !user) {
    console.error("Sign‑up error:", signUpError);
    return signUpError;
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .insert({ id: user.id, username, email });
  if (profileError) {
    return profileError;
  }

  return "success";
}

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  return error || true;
}

export async function createSubreddit(name: string, desc: string, user: any) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subreddits")
    .insert([
      {
        owner_id: user.data.id,
        name: name,
        title: name,
        description: desc,
      },
    ])
    .select();

  return { data, error };
}

export async function createPost(
  title: string,
  content: string,
  contentType: number,
  subreddit: any,
  user: any
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .insert([
      {
        author_id: user.data.id,
        subreddit_id: subreddit.id,
        title: title,
        content: JSON.stringify({ value: content, type: contentType }),
        content_type: contentType === 1, // true for image posts, false for text posts
      },
    ])
    .select();

  return { data, error };
}

export async function getSubreddit(name: string) {
  const supabase = await createClient();

  let { data, error } = await supabase
    .from("subreddits")
    .select("*")
    .ilike("name", name)
    .single();

  return { data, error };
}

export async function getPostFeed(
  sub?: string,
  page: number = 0,
  limit: number = 10
) {
  const supabase = await createClient();

  let query = supabase
    .from("post_feed")
    .select("*")
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  if (sub) {
    query = query.ilike("subreddit_name", sub);
  }

  const { data, error } = await query;

  return { data, error };
}

export async function votePost(postId: string, vote: boolean, user: any) {
  console.log("SERVER: votePost function called");
  const supabase = await createClient();

  if (!user?.data?.id) {
    console.log("SERVER: User not authenticated");
    return { error: { message: "User not authenticated" } };
  }

  // Convert boolean vote to integer: true = 1 (upvote), false = -1 (downvote)
  const voteValue = vote ? 1 : -1;
  console.log("SERVER: VotePost called:", {
    postId,
    vote,
    voteValue,
    userId: user.data.id,
  });

  // First, check if user has already voted on this post
  const { data: existingVote, error: voteCheckError } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", user.data.id)
    .single();

  console.log("SERVER: Existing vote check:", { existingVote, voteCheckError });

  if (voteCheckError && voteCheckError.code !== "PGRST116") {
    console.log("SERVER: Vote check error:", voteCheckError);
    return { error: voteCheckError };
  }

  if (existingVote) {
    // If vote is the same, remove the vote
    if (existingVote.vote === voteValue) {
      console.log("SERVER: Removing vote");
      const { error } = await supabase
        .from("votes")
        .delete()
        .eq("id", existingVote.id);
      console.log("SERVER: Vote removal result:", { error });
      return { data: null, error };
    } else {
      // Update the vote
      console.log("SERVER: Updating vote");
      const { data, error } = await supabase
        .from("votes")
        .update({ vote: voteValue })
        .eq("id", existingVote.id)
        .select();
      console.log("SERVER: Vote update result:", { data, error });
      return { data, error };
    }
  } else {
    // Create new vote
    console.log("SERVER: Creating new vote");
    const { data, error } = await supabase
      .from("votes")
      .insert([
        {
          user_id: user.data.id,
          post_id: postId,
          vote: voteValue,
        },
      ])
      .select();
    console.log("SERVER: Vote created:", { data, error });
    return { data, error };
  }
}

export async function subscribeToSub(subredditId: string, user: any) {
  const supabase = await createClient();

  if (!user?.data?.id) {
    return { error: { message: "User not authenticated" } };
  }

  // Check if already subscribed
  const { data: existingSub, error: checkError } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.data.id)
    .eq("subreddit_id", subredditId)
    .single();

  if (existingSub) {
    return { error: { message: "Already subscribed" } };
  }

  const { data, error } = await supabase
    .from("subscriptions")
    .insert({ user_id: user.data.id, subreddit_id: subredditId })
    .select();

  return { data, error };
}

export async function unsubscribeFromSub(subredditId: string, user: any) {
  const supabase = await createClient();

  if (!user?.data?.id) {
    return { error: { message: "User not authenticated" } };
  }

  const { data, error } = await supabase
    .from("subscriptions")
    .delete()
    .eq("user_id", user.data.id)
    .eq("subreddit_id", subredditId)
    .select();

  return { data, error };
}

export async function checkSubscription(subredditId: string, user: any) {
  const supabase = await createClient();

  if (!user?.data?.id) {
    return { isSubscribed: false, error: null };
  }

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.data.id)
    .eq("subreddit_id", subredditId)
    .single();

  return {
    isSubscribed: !!data && !error,
    error: error?.code === "PGRST116" ? null : error,
  };
}

export async function getSubreddits(user: any) {
  const supabase = await createClient();

  if (!user?.data?.id) {
    return { data: [], error: { message: "User not authenticated" } };
  }

  const { data, error } = await supabase
    .from("subscriptions")
    .select(
      `
      id,
      subreddit_id,
      subreddits (
        id,
        name,
        title,
        description,
        created_at,
        owner_id
      )
    `
    )
    .eq("user_id", user.data.id);

  return { data, error };
}

export async function getPost(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("post_feed")
    .select("*")
    .eq("id", id)
    ?.single();

  return { data, error };
}

export async function createComment(
  postId: string,
  content: string,
  user: any,
  parentId?: string
) {
  const supabase = await createClient();

  if (!user?.data?.id) {
    return { error: { message: "User not authenticated" } };
  }

  const { data, error } = await supabase.from("comments").insert({
    post_id: postId,
    author_id: user.data.id,
    content: content,
    parent_id: parentId || null,
  }).select(`
      *,
      profiles!comments_author_id_fkey (
        username
      )
    `);

  return { data, error };
}

export async function getComments(postId: string) {
  const supabase = await createClient();

  const user = await supabase.auth.getUser();
  const userId = user?.data?.user?.id;

  const { data, error } = await supabase
    .from("comments")
    .select(
      `
      *,
      profiles!comments_author_id_fkey (
        username
      )
    `
    )
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error || !data) {
    return { data, error };
  }

  // Get vote counts and user votes for all comments
  const commentIds = data.map((comment) => comment.id);

  // Get vote counts for all comments
  const { data: voteCounts } = await supabase
    .from("votes")
    .select("comment_id, vote")
    .in("comment_id", commentIds);

  // Get user's votes for all comments (if user is authenticated)
  let userVotes: any[] = [];
  if (userId) {
    const { data: userVoteData } = await supabase
      .from("votes")
      .select("comment_id, vote")
      .in("comment_id", commentIds)
      .eq("user_id", userId);
    userVotes = userVoteData || [];
  }

  // Calculate vote scores and user vote status for each comment
  const commentsWithVotes = data.map((comment) => {
    const commentVotes =
      voteCounts?.filter((vote) => vote.comment_id === comment.id) || [];
    const score = commentVotes.reduce((sum, vote) => sum + vote.vote, 0);
    const userVote = userVotes.find((vote) => vote.comment_id === comment.id);

    return {
      ...comment,
      score,
      userVote: userVote?.vote || 0,
    };
  });

  return { data: commentsWithVotes, error };
}

export async function deleteComment(commentId: string, user: any) {
  const supabase = await createClient();

  if (!user?.data?.id) {
    return { error: { message: "User not authenticated" } };
  }

  // Check if user owns the comment
  const { data: comment, error: fetchError } = await supabase
    .from("comments")
    .select("author_id")
    .eq("id", commentId)
    .single();

  if (fetchError) {
    return { error: fetchError };
  }

  if (comment.author_id !== user.data.id) {
    return { error: { message: "Unauthorized to delete this comment" } };
  }

  const { data, error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .select();

  return { data, error };
}

export async function voteComment(commentId: string, voteType: number) {
  const supabase = await createClient();

  const user = await supabase.auth.getUser();
  if (!user?.data?.user) {
    return { error: { message: "User not authenticated" } };
  }

  // Check if user has already voted on this comment
  const { data: existingVote, error: fetchError } = await supabase
    .from("votes")
    .select("*")
    .eq("comment_id", commentId)
    .eq("user_id", user.data.user.id)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    return { error: fetchError };
  }

  if (existingVote) {
    if (existingVote.vote === voteType) {
      // Remove vote if same vote type
      const { data, error } = await supabase
        .from("votes")
        .delete()
        .eq("id", existingVote.id)
        .select();
      return { data, error };
    } else {
      // Update vote if different vote type
      const { data, error } = await supabase
        .from("votes")
        .update({ vote: voteType })
        .eq("id", existingVote.id)
        .select();
      return { data, error };
    }
  } else {
    // Create new vote
    const { data, error } = await supabase
      .from("votes")
      .insert({
        comment_id: commentId,
        user_id: user.data.user.id,
        vote: voteType,
      })
      .select();
    return { data, error };
  }
}
