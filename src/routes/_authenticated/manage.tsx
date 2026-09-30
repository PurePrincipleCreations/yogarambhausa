import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { KeyRound, UserPlus } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { courses } from "@/data/courses";
import { getAdminStats, getMyRoles, inviteManager, listStudents, setAccess } from "@/lib/manage.functions";

export const Route = createFileRoute("/_authenticated/manage")({
  head: () => ({
    meta: [
      { title: "Manage students — Yogarambha Academy" },
      { name: "description", content: "Student progress and access management." },
      { property: "og:title", content: "Manage students — Yogarambha Academy" },
      { property: "og:description", content: "Student progress and access management." },
    ],
  }),
  component: ManagePage,
});

type Student = Awaited<ReturnType<typeof listStudents>>[number];

function ManagePage() {
  const rolesFn = useServerFn(getMyRoles);
  const { data: roles, isLoading } = useQuery({ queryKey: ["my-roles"], queryFn: () => rolesFn() });
  const isAdmin = roles?.includes("admin");
  const isStaff = isAdmin || roles?.includes("manager");

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted px-5 pt-32 pb-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          {isLoading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : !isStaff ? (
            <div className="rounded-3xl bg-card p-10 text-center shadow-lg">
              <h1 className="text-3xl font-bold text-foreground">Teachers only</h1>
              <p className="mt-3 text-muted-foreground">This area is for Yogarambha managers and admins.</p>
              <Button asChild className="mt-6 rounded-full bg-ember text-primary-foreground hover:bg-ember/90">
                <Link to="/">Return home</Link>
              </Button>
            </div>
          ) : (
            <>
              <p className="text-xs font-semibold tracking-[0.18em] text-ember uppercase">{isAdmin ? "Admin" : "Manager"}</p>
              <h1 className="mt-2 text-4xl font-bold text-foreground sm:text-5xl">Student management</h1>
              {isAdmin && <AdminPanel />}
              <StudentTable />
            </>
          )}
        </div>
      </main>
    </>
  );
}

function AdminPanel() {
  const statsFn = useServerFn(getAdminStats);
  const invite = useServerFn(inviteManager);
  const { data } = useQuery({ queryKey: ["admin-stats"], queryFn: () => statsFn() });
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState<string | null>(null);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    try {
      const res = await invite({ data: { email: String(f.get("email")), name: String(f.get("name")) } });
      toast.success(res.isNew ? "Manager account created." : "Existing user promoted to manager.");
      setLink(res.setPasswordLink);
      if (!res.setPasswordLink) setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not invite");
    }
  };

  return (
    <section className="mt-8 grid gap-4 sm:grid-cols-3">
      <div className="rounded-3xl bg-card p-6 shadow-lg">
        <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">Stripe revenue</p>
        <p className="mt-2 text-3xl font-bold text-foreground">
          {data?.connected ? `$${data.revenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : "—"}
        </p>
        {data && !data.connected && <p className="mt-1 text-xs text-muted-foreground">Stripe not connected yet</p>}
      </div>
      <div className="rounded-3xl bg-card p-6 shadow-lg">
        <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">Total sales</p>
        <p className="mt-2 text-3xl font-bold text-foreground">{data?.connected ? data.sales : "—"}</p>
      </div>
      <div className="flex items-center justify-center rounded-3xl bg-foreground p-6 shadow-lg">
        <Button onClick={() => { setLink(null); setOpen(true); }} className="h-12 rounded-full bg-ember px-6 text-primary-foreground hover:bg-ember/90">
          <UserPlus aria-hidden="true" /> Invite Manager
        </Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-[2rem] p-8">
          <DialogHeader>
            <DialogTitle>Invite a manager</DialogTitle>
            <DialogDescription>They'll be able to see students and manage access.</DialogDescription>
          </DialogHeader>
          {link ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Share this one-time link so they can set their password:</p>
              <Input readOnly value={link} onFocus={(e) => e.currentTarget.select()} />
              <Button onClick={() => { void navigator.clipboard.writeText(link); toast.success("Link copied"); }} className="w-full rounded-full">Copy link</Button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2"><Label htmlFor="m-name">Name</Label><Input id="m-name" name="name" required maxLength={100} /></div>
              <div className="space-y-2"><Label htmlFor="m-email">Email</Label><Input id="m-email" name="email" type="email" required maxLength={255} /></div>
              <Button type="submit" className="w-full rounded-full bg-ember text-primary-foreground hover:bg-ember/90">Create manager</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function StudentTable() {
  const listFn = useServerFn(listStudents);
  const { data: students = [], isLoading } = useQuery({ queryKey: ["students"], queryFn: () => listFn() });
  const [editing, setEditing] = useState<Student | null>(null);

  return (
    <section className="mt-10 overflow-hidden rounded-3xl bg-card shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[46rem] text-left text-sm">
          <thead className="border-b border-border text-xs tracking-[0.12em] text-muted-foreground uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold">Student</th>
              <th className="px-6 py-4 font-semibold">Email</th>
              <th className="px-6 py-4 font-semibold">Bundles</th>
              <th className="px-6 py-4 font-semibold">Progress</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={5} className="px-6 py-8 text-muted-foreground">Loading…</td></tr>}
            {!isLoading && students.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-muted-foreground">No students yet.</td></tr>
            )}
            {students.map((s) => (
              <tr key={s.id} className="border-b border-border/60 last:border-0">
                <td className="px-6 py-4 font-medium text-foreground">{s.name}</td>
                <td className="px-6 py-4 text-muted-foreground">{s.email}</td>
                <td className="px-6 py-4 text-muted-foreground">
                  {s.slugs.length ? s.slugs.map((slug) => courses.find((c) => c.slug === slug)?.title ?? slug).join(", ") : "—"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-ember" style={{ width: `${s.progress}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-foreground">{s.progress}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="outline" size="sm" onClick={() => setEditing(s)} className="rounded-full">
                    <KeyRound aria-hidden="true" /> Manage Access
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && <AccessDialog student={editing} onClose={() => setEditing(null)} />}
    </section>
  );
}

function AccessDialog({ student, onClose }: { student: Student; onClose: () => void }) {
  const setFn = useServerFn(setAccess);
  const qc = useQueryClient();
  const [slugs, setSlugs] = useState(new Set(student.slugs));

  const toggle = async (slug: string, grant: boolean) => {
    try {
      await setFn({ data: { userId: student.id, slug, grant } });
      setSlugs((cur) => { const n = new Set(cur); grant ? n.add(slug) : n.delete(slug); return n; });
      void qc.invalidateQueries({ queryKey: ["students"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update access");
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md rounded-[2rem] p-8">
        <DialogHeader>
          <DialogTitle>Access for {student.name}</DialogTitle>
          <DialogDescription>Grant or remove bundles. Changes save instantly.</DialogDescription>
        </DialogHeader>
        <ul className="max-h-[50vh] space-y-2 overflow-y-auto">
          {courses.map((c) => (
            <li key={c.slug}>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl p-3 hover:bg-muted">
                <Checkbox checked={slugs.has(c.slug)} onCheckedChange={(v) => void toggle(c.slug, v === true)} />
                <span className="text-sm font-medium text-foreground">{c.title}</span>
              </label>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
