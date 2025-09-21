const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;
export type Jsonish = Record<string, any> | undefined;

export type AuthResponse = {
  accessToken?: string;
  token?: string;
  data?: {
    accessToken?: string;
    token?: string;
  };
  message?: string;
  error?: string;
  otpRequired?: boolean; // used by /auth/login-init (if your backend returns it)
};

async function asJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!res.ok) {
    try {
      const j = text ? JSON.parse(text) : {};
      const msg = j?.message || j?.error || res.statusText;
      throw new Error(typeof msg === "string" ? msg : res.statusText);
    } catch {
      throw new Error(text || res.statusText);
    }
  }
  return (text ? JSON.parse(text) : {}) as T;
}

/** ---------- Sign-in (password) step-1: verify PW & trigger OTP ---------- */
/** Preferred route; if your backend doesn't yet have it, the frontend falls back automatically. */
export async function loginInit(email: string, password: string): Promise<AuthResponse> {
  return asJson<AuthResponse>(
    await fetch(`${BASE}/auth/login-init`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    })
  );
}

/** Legacy/compat route (do not finish session on FE for 2FA) */
export async function loginWithPassword(email: string, password: string): Promise<AuthResponse> {
  return asJson<AuthResponse>(
    await fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    })
  );
}

/** ---------- Sign-up ---------- */
export async function registerWithEmailPassword(email: string, password: string): Promise<Jsonish> {
  return asJson<Jsonish>(
    await fetch(`${BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    })
  );
}

/** ---------- OTP endpoints ---------- */
export async function verifyOtp(payload: { email?: string; phone?: string; otp: string }): Promise<AuthResponse> {
  return asJson<AuthResponse>(
    await fetch(`${BASE}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    })
  );
}

export async function sendOtp(payload: { email?: string; phone?: string }): Promise<{ message?: string }> {
  return asJson<{ message?: string }>(
    await fetch(`${BASE}/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    })
  );
}

export async function resendOtp(payload: { email?: string; phone?: string }): Promise<{ message?: string }> {
  return asJson<{ message?: string }>(
    await fetch(`${BASE}/auth/re-send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    })
  );
}

/** ---------- Utilities ---------- */
export async function logout(): Promise<Jsonish> {
  return asJson<Jsonish>(await fetch(`${BASE}/auth/logout`, { method: "POST", credentials: "include" }));
}
export async function getProfile(): Promise<Jsonish> {
  return asJson<Jsonish>(await fetch(`${BASE}/auth/profile`, { method: "GET", credentials: "include" }));
}

/** Used to warn on OTP sign-in if user doesn't exist. */
export async function checkUserStatus(
  id: { email?: string; phone?: string } | { kind: "email"; email: string } | { kind: "phone"; phone: string }
): Promise<boolean> {
  const email = (id as any)?.email as string | undefined;
  const phone = (id as any)?.phone as string | undefined;
  const qs = email ? `email=${encodeURIComponent(email)}` : phone ? `phone=${encodeURIComponent(phone)}` : "";
  try {
    const res = await fetch(`${BASE}/auth/check-user-status?${qs}`, { credentials: "include" });
    return res.ok;
  } catch {
    return true;
  }
}
