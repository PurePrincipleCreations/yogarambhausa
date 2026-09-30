import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { GraduationCap, MessageCircle, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/stores/useAuthStore";

export const Route = createFileRoute("/_authenticated/community")({
  head: () => ({
    meta: [
      { title: "Community — Yogarambha Academy" },
      { name: "description", content: "Share form checks, questions and wins with your teachers and fellow students." },
      { property: "og:title", content: "Community — Yogarambha Academy" },
      { property: "og:description", content: "Share form checks, questions and wins with your teachers and fellow students." },
    ],
  }),
  component: CommunityPage,
});

const TAGS = [
  { value: "form_check", label: "Form Check" },
  { value: "question", label: "Question" },
  { value: "win", label: "Win" },
] as const;
type Tag = (typeof TAGS)[number]["value"];

function CommunityPage() {
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Tag | "all">("all");
  const [tag, setTag] = useState<Tag>("question");

  const { data: posts = [] } = useQuery({
    queryKey: ["community-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_posts")
        .select("*, community_replies(*)")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  const createPost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const formEl = e.currentTarget;
    const f = new FormData(formEl);
    const videoUrl = String(f.get("video_url") ?? "").trim();
    if (videoUrl && !/^https:\/\//.test(videoUrl)) return toast.error("Video link must start with https://");
    const { error } = await supabase.from("community_posts").insert({
      user_id: user.id,
      author_name: user.name.slice(0, 80),
      title: String(f.get("title")).trim().slice(0, 160),
      content: String(f.get("content")).trim().slice(0, 5000),
      video_url: videoUrl || null,
      tag,
    });
    if (error) return toast.error(error.message);
    formEl.reset();
    toast.success("Posted to the community.");
    void qc.invalidateQueries({ queryKey: ["community-posts"] });
  };

  const shown = filter === "all" ? posts : posts.filter((p) => p.tag === filter);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted px-5 pt-32 pb-20 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-ember uppercase">Sangha</p>
          <h1 className="mt-2 text-4xl font-bold text-foreground sm:text-5xl">Community</h1>
          <p className="mt-3 text-muted-foreground">Ask questions, share your form for feedback, and celebrate progress.</p>

          <form onSubmit={createPost} className="mt-8 space-y-4 rounded-3xl bg-card p-6 shadow-lg">
            <div className="flex flex-wrap gap-2">
              {TAGS.map((t) => (
                <button key={t.value} type="button" onClick={() => setTag(t.value)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${tag === t.value ? "bg-ember text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                  {t.label}
                </button>
              ))}
            </div>
            <Input name="title" required maxLength={160} placeholder="Title" className="h-11 rounded-xl" />
            <Textarea name="content" required maxLength={5000} rows={4} placeholder="Share the details…" className="rounded-xl" />
            <Input name="video_url" type="url" maxLength={500} placeholder="Optional video link (https://…)" className="h-11 rounded-xl" />
            <Button type="submit" className="rounded-full bg-ember px-6 text-primary-foreground hover:bg-ember/90">Post</Button>
          </form>

          <div className="mt-10 flex flex-wrap gap-2">
            {(["all", ...TAGS.map((t) => t.value)] as const).map((v) => (
              <Button key={v} type="button" size="sm" variant={filter === v ? "default" : "secondary"} onClick={() => setFilter(v)} className="rounded-full">
                {v === "all" ? "All" : TAGS.find((t) => t.value === v)?.label}
              </Button>
            ))}
          </div>

          <ul className="mt-6 space-y-5">
            {shown.length === 0 && <li className="rounded-3xl bg-card p-8 text-center text-muted-foreground">No posts yet — start the conversation.</li>}
            {shown.map((p) => <PostCard key={p.id} post={p} />)}
          </ul>
        </div>
      </main>
    </>
  );
}

type Post = {
  id: string; title: string; content: string; tag: string; author_name: string; video_url: string | null; created_at: string;
  community_replies: { id: string; content: string; author_name: string; is_teacher_reply: boolean; created_at: string }[];
};

function PostCard({ post }: { post: Post }) {
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const replies = [...post.community_replies].sort((a, b) => a.created_at.localeCompare(b.created_at));

  const reply = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const formEl = e.currentTarget;
    const content = String(new FormData(formEl).get("content")).trim();
    if (!content) return;
    const { error } = await supabase.from("community_replies").insert({
      post_id: post.id, user_id: user.id, author_name: user.name.slice(0, 80), content: content.slice(0, 3000),
    });
    if (error) return toast.error(error.message);
    formEl.reset();
    void qc.invalidateQueries({ queryKey: ["community-posts"] });
  };

  return (
    <li className="rounded-3xl bg-card p-6 shadow-lg">
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="rounded-full bg-ember/10 px-3 py-1 font-semibold text-ember">{TAGS.find((t) => t.value === post.tag)?.label}</span>
        <span>{post.author_name}</span>
        <span>·</span>
        <span>{new Date(post.created_at).toLocaleDateString()}</span>
      </div>
      <h2 className="mt-3 text-xl font-semibold text-card-foreground">{post.title}</h2>
      <p className="mt-2 whitespace-pre-line leading-relaxed text-muted-foreground">{post.content}</p>
      {post.video_url && /^https:\/\//.test(post.video_url) && (
        <a href={post.video_url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-ember hover:underline">
          <Video className="size-4" aria-hidden="true" /> Watch video
        </a>
      )}
      <div className="mt-5 space-y-3 border-t border-border/60 pt-4">
        {replies.map((r) => (
          <div key={r.id} className={`rounded-2xl p-3.5 text-sm ${r.is_teacher_reply ? "border border-ember/30 bg-ember/5" : "bg-muted"}`}>
            <p className="flex items-center gap-2 text-xs font-semibold text-foreground">
              {r.is_teacher_reply && <GraduationCap className="size-3.5 text-ember" aria-hidden="true" />}
              {r.author_name}{r.is_teacher_reply && <span className="text-ember">· Teacher</span>}
            </p>
            <p className="mt-1 whitespace-pre-line text-muted-foreground">{r.content}</p>
          </div>
        ))}
        <form onSubmit={reply} className="flex gap-2">
          <Input name="content" maxLength={3000} placeholder="Write a reply…" className="h-10 rounded-full" />
          <Button type="submit" size="icon" variant="outline" aria-label="Send reply" className="size-10 shrink-0 rounded-full">
            <MessageCircle aria-hidden="true" />
          </Button>
        </form>
      </div>
    </li>
  );
}
