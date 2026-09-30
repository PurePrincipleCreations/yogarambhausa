import { type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function LessonNotes({ lessonId }: { lessonId: string }) {
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
    const content = String(f.get("content")).trim();
    const stamp = String(f.get("stamp")).trim();
    if (!content) return;
    if (stamp && !/^\d{1,2}:\d{2}(:\d{2})?$/.test(stamp)) { toast.error("Use a time like 14:22"); return; }
    const { error } = await supabase.from("notes").insert({
      user_id: userId, lesson_id: lessonId, content: content.slice(0, 2000), video_timestamp: stamp || null,
    });
    if (error) { toast.error(error.message); return; }
    formEl.reset();
    void qc.invalidateQueries({ queryKey: key });
  };

  const remove = async (id: string) => {
    await supabase.from("notes").delete().eq("id", id);
    void qc.invalidateQueries({ queryKey: key });
  };

  return (
    <section className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-lg">
      <h2 className="text-lg font-semibold text-card-foreground">Your notes</h2>
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
      <form onSubmit={add} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Input name="stamp" placeholder="14:22" maxLength={8} className="h-11 rounded-xl sm:w-24" />
        <Textarea name="content" required maxLength={2000} rows={1} placeholder="Add a note…" className="min-h-11 flex-1 rounded-xl" />
        <Button type="submit" className="h-11 rounded-full bg-ember px-5 text-primary-foreground hover:bg-ember/90">Save</Button>
      </form>
    </section>
  );
}
