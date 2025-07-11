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

export async function getSubs(user: any) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.data.id);

  return { data, error };
}
