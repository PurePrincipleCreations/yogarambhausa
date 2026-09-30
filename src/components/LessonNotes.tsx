import { useEffect, useRef, useState, type FormEvent } from "react";
import { Clock } from "lucide-react";
import { formatStamp } from "@/components/player/VideoStage";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function LessonNotes({ lessonId, getCurrentTime }: { lessonId: string; getCurrentTime?: () => number }) {
  const [stamp, setStamp] = useState<string | null>(null);
  const area = useRef<HTMLTextAreaElement>(null);
  const [now, setNow] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setNow(getCurrentTime?.() ?? 0), 1000);
    return () => clearInterval(t);
  }, [getCurrentTime]);
  const addStamp = () => {
    const t = formatStamp(getCurrentTime?.() ?? 0);
    setStamp(t);
    const el = area.current;
    if (el && !el.value.startsWith(`[${t}]`)) { el.value = `[${t}] ${el.value.replace(/^\[[\d:]+\]\s*/, "")}`; el.focus(); }
  };
  const userId = useAuthStore((s) => s.user?.id);
  const qc = useQueryClient();
  const key = ["notes", userId, lessonId];
  const { data: notes = [] } = useQuery({
    queryKey: key,
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await supabase.from("notes").select("*").eq("lesson_id", lessonId).order("created_at");
      return data ?? [];
    },
  });

  const add = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) return;
    const formEl = e.currentTarget;
    const f = new FormData(formEl);
    const content = String(f.get("content")).replace(/^\[[\d:]+\]\s*/, "").trim();
    if (!content) return;
    const { error } = await supabase.from("notes").insert({
      user_id: userId, lesson_id: lessonId, content: content.slice(0, 2000), video_timestamp: stamp,
    });
    if (error) { toast.error(error.message); return; }
    formEl.reset();
    setStamp(null);
    void qc.invalidateQueries({ queryKey: key });
  };

  const remove = async (id: string) => {
    await supabase.from("notes").delete().eq("id", id);
    void qc.invalidateQueries({ queryKey: key });
  };

  return (
    <section className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-lg">
      <h2 className="text-lg font-semibold text-card-foreground">My Notes</h2>
      <ul className="mt-4 space-y-2">
        {notes.length === 0 && <li className="text-sm text-muted-foreground">No notes for this lesson yet.</li>}
        {notes.map((n) => (
          <li key={n.id} className="group flex items-start gap-3 rounded-2xl bg-muted p-3 text-sm">
            {n.video_timestamp && <span className="shrink-0 rounded-full bg-ember/10 px-2.5 py-0.5 text-xs font-semibold text-ember">{n.video_timestamp}</span>}
            <p className="flex-1 whitespace-pre-line text-foreground">{n.content}</p>
            <button type="button" onClick={() => void remove(n.id)} aria-label="Delete note" className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground">
              <Trash2 className="size-4" />
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={add} className="mt-4 space-y-3">
        <Textarea ref={area} name="content" required maxLength={2000} rows={3} placeholder="Write what you noticed in this lesson…" className="rounded-2xl border-border/60 bg-muted/60" />
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={addStamp} className="h-10 rounded-full">
            <Clock aria-hidden="true" /> Add {formatStamp(now)}
          </Button>
          <Button type="submit" className="h-10 rounded-full bg-ember px-5 text-primary-foreground hover:bg-ember/90">Save note</Button>
        </div>
      </form>
    </section>
  );
}
