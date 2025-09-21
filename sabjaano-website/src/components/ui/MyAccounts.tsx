"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, CreditCard, Shield, BarChart2, LogOut, Edit3, Zap, Save, ToggleRight,
} from "lucide-react";
import Link from "next/link";

// ---------- API helpers ----------
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const TOKEN_KEY = "sj_access_token";

async function fetchJSON<T = any>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* non-JSON */ }
  if (!res.ok) throw new Error((data && (data.message || data.error)) || res.statusText);
  return (data?.data ?? data) as T; // supports {data:{...}} or raw payloads
}

// ---------- Types ----------
type Profile = {
  firstname?: string;
  lastname?: string;
  name?: string;
  email: string;
  phone?: string;
  avatar?: string;
};

// ---------- Mock plan/activity/billing (unchanged) ----------
const planInfo = { name: "Plus Plan", renewalDate: "October 1, 2025" };
const recentActivity = [
  { id: 1, action: "New ad campaign 'Diwali Dhamaka' created.", time: "2 hours ago" },
  { id: 2, action: "Payment for September was successful.", time: "1 day ago" },
  { id: 3, action: "Analytics report for 'Summer Fest' is ready.", time: "3 days ago" },
];
const billingHistory = [
  { id: "inv_123", date: "Sep 1, 2025", amount: "₹9,999", status: "Paid" },
  { id: "inv_122", date: "Aug 1, 2025", amount: "₹9,999", status: "Paid" },
  { id: "inv_121", date: "Jul 1, 2025", amount: "₹9,999", status: "Paid" },
];

// ---------- Reusable UI ----------
const DashboardCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-gray-800/50 border border-gray-700 rounded-2xl p-6 ${className}`}>{children}</div>
);

const NavItem = ({
  icon, label, active, onClick,
}: { icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full gap-4 px-4 py-3 rounded-lg transition-colors ${
      active ? "bg-cyan-500/20 text-cyan-300" : "text-gray-400 hover:bg-gray-700/50 hover:text-white"
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

// ---------- Panels ----------
const DashboardPanel = ({ displayName }: { displayName: string }) => (
  <div className="space-y-8">
    <DashboardCard className="bg-gradient-to-br from-purple-600/50 to-cyan-600/50 !border-cyan-500/50">
      <div className="flex flex-col md:flex-row justify-between items-start">
        <div>
          <div className="flex items-center gap-3">
            <Zap className="text-yellow-400" />
            <h3 className="text-2xl font-bold">Your Current Plan</h3>
          </div>
          <p className="text-5xl font-extrabold my-4">{planInfo.name}</p>
          <p className="text-purple-300 font-semibold">Renews on {planInfo.renewalDate}</p>
          <p className="mt-2 text-sm text-purple-100/80">Hi {displayName.split(" ")[0] || "there"} 👋</p>
        </div>
        <Link href="/choose-plan">
          <button className="mt-4 md:mt-0 bg-white text-black font-bold py-3 px-6 rounded-lg hover:bg-gray-200 transition-transform hover:scale-105">
            Manage Plan
          </button>
        </Link>
      </div>
    </DashboardCard>

    <DashboardCard>
      <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
      <ul className="space-y-4">
        {recentActivity.map((a) => (
          <li key={a.id} className="flex justify-between items-center text-sm border-b border-gray-700 pb-2 last:border-b-0">
            <p className="text-gray-300">{a.action}</p>
            <p className="text-gray-500">{a.time}</p>
          </li>
        ))}
      </ul>
    </DashboardCard>
  </div>
);

function ProfileSettingsPanel({
  form,
  setForm,
  onSave,
  saving,
  saveError,
  saveSuccess,
  email,
}: {
  form: { firstname: string; lastname: string; phone: string; avatar: string };
  setForm: (next: typeof form) => void;
  onSave: () => void;
  saving: boolean;
  saveError: string | null;
  saveSuccess: boolean;
  email: string;
}) {
  return (
    <DashboardCard>
      <h3 className="text-2xl font-bold mb-6">Profile Settings</h3>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
            <input
              type="text"
              value={form.firstname}
              onChange={(e) => setForm({ ...form, firstname: e.target.value })}
              placeholder="Your first name"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
            <input
              type="text"
              value={form.lastname}
              onChange={(e) => setForm({ ...form, lastname: e.target.value })}
              placeholder="Your last name"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Email (from Sign-in)</label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full bg-gray-800/60 border border-gray-600 rounded-lg px-4 py-2 text-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="Phone number"
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Avatar URL</label>
          <div className="flex items-center gap-4">
            {form.avatar ? (
              <img src={form.avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-700" />
            )}
            <input
              type="text"
              value={form.avatar}
              onChange={(e) => setForm({ ...form, avatar: e.target.value })}
              placeholder="https://…"
              className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
        </div>

        {saveError && <p className="text-red-400">{saveError}</p>}
        {saveSuccess && <p className="text-green-400">Profile updated!</p>}

        <div className="pt-2 flex justify-end">
          <motion.button
            type="submit"
            disabled={saving}
            className="bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 disabled:opacity-60"
            whileHover={{ scale: saving ? 1 : 1.05 }}
            whileTap={{ scale: saving ? 1 : 0.95 }}
          >
            <Save size={18} />
            {saving ? "Saving…" : "Save Changes"}
          </motion.button>
        </div>
      </form>
    </DashboardCard>
  );
}

const BillingPlanPanel = () => (
  <DashboardCard>
    <h3 className="text-2xl font-bold mb-6">Billing & Plan</h3>
    <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 mb-6">
      <p className="text-gray-400">Current Plan</p>
      <p className="text-3xl font-bold text-cyan-400">{planInfo.name}</p>
      <p className="text-gray-400 mt-2">Billed monthly. Renews on {planInfo.renewalDate}.</p>
      <Link href="/choose-plan">
        <button className="text-cyan-400 font-semibold mt-4 hover:underline">Change Plan</button>
      </Link>
    </div>
    <h4 className="text-xl font-semibold mb-4">Billing History</h4>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-700 text-sm text-gray-400">
            <th className="py-2">Invoice ID</th>
            <th className="py-2">Date</th>
            <th className="py-2">Amount</th>
            <th className="py-2 text-right">Status</th>
          </tr>
        </thead>
        <tbody>
          {billingHistory.map((item) => (
            <tr key={item.id} className="border-b border-gray-800 text-sm">
              <td className="py-3">{item.id}</td>
              <td className="py-3">{item.date}</td>
              <td className="py-3">{item.amount}</td>
              <td className="py-3 text-right">
                <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">{item.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </DashboardCard>
);

const SecurityPanel = () => (
  <DashboardCard>
    <h3 className="text-2xl font-bold mb-6">Security</h3>
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold text-white mb-2">Change Password</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input type="password" placeholder="Current Password" className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2" />
          </div>
          <div className="relative">
            <input type="password" placeholder="New Password" className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2" />
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-lg font-semibold text-white mb-2">Two-Factor Authentication</h4>
        <div className="flex items-center justify-between bg-gray-900/50 p-4 rounded-lg border border-gray-700">
          <p className="text-gray-400">Enable 2FA to add an extra layer of security to your account.</p>
          <button>
            <ToggleRight size={32} className="text-cyan-400" />
          </button>
        </div>
      </div>
      <div className="pt-4 flex justify-end">
        <motion.button
          type="submit"
          className="bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Update Security
        </motion.button>
      </div>
    </div>
  </DashboardCard>
);

// ---------- Main ----------
export default function MyAccounts() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"Dashboard" | "Profile" | "Billing" | "Security">("Dashboard");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // editable form state (minimal fields)
  const [form, setForm] = useState({ firstname: "", lastname: "", phone: "", avatar: "" });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;

  useEffect(() => {
    (async () => {
      if (!token) {
        setErr("Access token is required");
        setLoading(false);
        return;
      }
      try {
        const me = await fetchJSON<Profile>(`${API_BASE}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        setProfile(me);
        setForm({
          firstname: me.firstname || "",
          lastname: me.lastname || "",
          phone: me.phone || "",
          avatar: me.avatar || "",
        });
      } catch (e: any) {
        setErr(e?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayName = useMemo(() => {
    if (!profile) return "";
    const combined = `${profile.firstname ?? ""} ${profile.lastname ?? ""}`.trim();
    return combined || profile.name || profile.email || "User";
  }, [profile]);

  const avatarUrl = form.avatar || profile?.avatar || "https://placehold.co/100x100/111827/a5b4fc?text=U";

  async function saveProfile() {
    if (!token || !profile?.email) return;
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const body = {
      firstname: form.firstname || undefined,
      lastname: form.lastname || undefined,
      phone: form.phone || undefined,
      avatar: form.avatar || undefined,
      // keep email unchanged (read-only), backend may infer from token
    };

    // Try PATCH /auth/profile, fallback to PUT /auth/profile, then POST /auth/update-profile
    const tries: Array<RequestInit & { url: string }> = [
      { url: `${API_BASE}/auth/profile`, method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, credentials: "include", body: JSON.stringify(body) },
      { url: `${API_BASE}/auth/profile`, method: "PUT",   headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, credentials: "include", body: JSON.stringify(body) },
      { url: `${API_BASE}/auth/update-profile`, method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, credentials: "include", body: JSON.stringify({ email: profile.email, ...body }) },
    ];

    let lastErr: any = null;
    for (const attempt of tries) {
      try {
        const updated = await fetchJSON<Profile>(attempt.url, attempt);
        setProfile(updated);
        setSaveSuccess(true);
        // sync form with any normalized values from server
        setForm({
          firstname: updated.firstname || "",
          lastname: updated.lastname || "",
          phone: updated.phone || "",
          avatar: updated.avatar || "",
        });
        setSaving(false);
        return;
      } catch (e) {
        lastErr = e;
      }
    }
    setSaving(false);
    setSaveError(lastErr?.message || "Failed to update profile");
  }

  const handleLogout = async () => {
    try {
      await fetchJSON(`${API_BASE}/auth/logout`, { method: "POST", credentials: "include" });
    } catch {
      // ignore API error on logout
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      router.push("/");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <DashboardPanel displayName={displayName} />;
      case "Profile":
        return (
          <ProfileSettingsPanel
            form={form}
            setForm={setForm}
            onSave={saveProfile}
            saving={saving}
            saveError={saveError}
            saveSuccess={saveSuccess}
            email={profile?.email || ""}
          />
        );
      case "Billing":
        return <BillingPlanPanel />;
      case "Security":
        return <SecurityPanel />;
      default:
        return <DashboardPanel displayName={displayName} />;
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <style jsx global>{`
        .aurora-bg-account {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 40vh;
          z-index: 0;
          overflow: hidden;
          background: radial-gradient(ellipse at 50% 0%, rgba(34, 211, 238, 0.2), transparent 70%);
        }
      `}</style>

      <div className="relative">
        <div className="aurora-bg-account" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <header className="py-12 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">My Account</h1>
              <p className="mt-2 text-gray-400">Manage your profile, plan, and settings.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleLogout}
                className="bg-gray-800/50 hover:bg-gray-700/50 text-white font-semibold py-2 px-5 rounded-lg transition"
              >
                Log out
              </button>
              <Link href="/">
                <button className="bg-gray-800/50 hover:bg-gray-700/50 text-white font-semibold py-2 px-5 rounded-lg transition">
                  Back to Home
                </button>
              </Link>
            </div>
          </header>

          {loading ? (
            <div className="p-6">Loading…</div>
          ) : err ? (
            <div className="p-6 text-red-400">{err}</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <aside className="lg:col-span-1">
                <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative">
                      <img src={avatarUrl} alt="User Avatar" className="w-24 h-24 rounded-full border-4 border-gray-700 object-cover" />
                      <button
                        className="absolute bottom-0 right-0 bg-cyan-500 p-1.5 rounded-full hover:bg-cyan-600 transition"
                        onClick={() => setActiveTab("Profile")}
                        aria-label="Edit profile"
                      >
                        <Edit3 size={12} />
                      </button>
                    </div>
                    <h2 className="text-xl font-semibold mt-4">{displayName || "User"}</h2>
                    <p className="text-sm text-gray-400">{profile?.email}</p>
                  </div>

                  <nav className="mt-8 space-y-2">
                    <NavItem icon={<BarChart2 size={20} />} label="Dashboard" active={activeTab === "Dashboard"} onClick={() => setActiveTab("Dashboard")} />
                    <NavItem icon={<User size={20} />} label="Profile Settings" active={activeTab === "Profile"} onClick={() => setActiveTab("Profile")} />
                    <NavItem icon={<CreditCard size={20} />} label="Billing & Plan" active={activeTab === "Billing"} onClick={() => setActiveTab("Billing")} />
                    <NavItem icon={<Shield size={20} />} label="Security" active={activeTab === "Security"} onClick={() => setActiveTab("Security")} />
                    <NavItem icon={<LogOut size={20} />} label="Logout" onClick={handleLogout} />
                  </nav>
                </div>
              </aside>

              <main className="lg:col-span-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderContent()}
                  </motion.div>
                </AnimatePresence>
              </main>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
