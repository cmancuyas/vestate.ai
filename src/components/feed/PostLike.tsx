// src/components/feed/PostLike.tsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function PostLike({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadLikeStatus = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      const { data } = await supabase
        .from("post_likes")
        .select("*")
        .eq("user_id", user.id)
        .eq("post_id", postId)
        .single();
      setLiked(!!data);
    };

    loadLikeStatus();
  }, [postId]);

  const toggleLike = async () => {
    if (!userId) return;

    if (liked) {
      const { error } = await supabase
        .from("post_likes")
        .delete()
        .eq("user_id", userId)
        .eq("post_id", postId);

      if (!error) setLiked(false);
    } else {
      const { error } = await supabase
        .from("post_likes")
        .insert([{ user_id: userId, post_id: postId }]);

      if (!error) setLiked(true);
    }
  };

  return (
    <button
      onClick={toggleLike}
      className="text-sm text-blue-600 hover:underline"
    >
      {liked ? "❤️ Liked" : "🤍 Like"}
    </button>
  );
}
