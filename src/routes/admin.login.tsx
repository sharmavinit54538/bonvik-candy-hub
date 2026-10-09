import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, Loader2, ShieldCheck, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — Bonvik Foods" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // If already logged in as admin, redirect to /admin/leads immediately
  useEffect(() => {
    let mounted = true;

    async function checkExistingSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || !session.user) {
          if (mounted) setCheckingAuth(false);
          return;
        }

        const user = session.user;
        const hasMetadataRole =
          user.app_metadata?.role === "admin" ||
          user.user_metadata?.role === "admin";

        if (hasMetadataRole) {
          navigate({ to: "/admin/leads" });
          return;
        }

        // Check admin_users table
        const { data: adminRow } = await supabase
          .from("admin_users")
          .select("id")
          .eq("id", user.id)
          .maybeSingle();

        if (adminRow && mounted) {
          navigate({ to: "/admin/leads" });
          return;
        }

        if (mounted) setCheckingAuth(false);
      } catch (err) {
        if (mounted) setCheckingAuth(false);
      }
    }

    checkExistingSession();
    return () => {
      mounted = false;
    };
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error || !data.user) {
        toast.error(error?.message || "Invalid credentials. Please try again.");
        setLoading(false);
        return;
      }

      // Verify admin role
      const user = data.user;
      const hasMetadataRole =
        user.app_metadata?.role === "admin" ||
        user.user_metadata?.role === "admin";

      if (hasMetadataRole) {
        toast.success(`Welcome back, ${user.email}!`);
        navigate({ to: "/admin/leads" });
        return;
      }

      // Check admin_users table
      const { data: adminRow, error: adminErr } = await supabase
        .from("admin_users")
        .select("id, role")
        .eq("id", user.id)
        .maybeSingle();

      if (adminRow) {
        toast.success(`Welcome back, ${user.email}!`);
        navigate({ to: "/admin/leads" });
        return;
      }

      // User is authenticated but NOT an admin
      console.warn("[AdminLogin] User lacks admin privileges:", user.id, adminErr);
      await supabase.auth.signOut();
      toast.error("Access denied. Your account does not have administrator privileges.");
    } catch (err: any) {
      console.error("[AdminLogin] Login error:", err);
      toast.error(err?.message || "An unexpected error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center -mt-20 pt-20">
        <div className="flex items-center gap-3 text-white/70">
          <Loader2 className="h-6 w-6 animate-spin text-candy-red" />
          <span>Verifying admin session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white -mt-20 pt-28 pb-16 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-glow opacity-30 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/60 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={14} /> Back to website
          </Link>
          <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-candy text-white shadow-candy mb-4">
            <ShieldCheck size={28} />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Admin Portal</h1>
          <p className="mt-2 text-sm text-white/60">
            Sign in with your Bonvik administrator credentials to manage leads and applications.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-xl shadow-soft">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bonvikfoods.com"
                  required
                  autoFocus
                  className="w-full rounded-2xl border border-white/15 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-candy-red transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full rounded-2xl border border-white/15 bg-white/5 pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-candy-red transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-candy text-white py-3 px-5 text-sm font-semibold shadow-candy hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  Sign in to CRM <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-xs text-white/40">
          Bonvik Foods Lead Management System · Developed by Equinoxsphere
        </div>
      </motion.div>
    </div>
  );
}
