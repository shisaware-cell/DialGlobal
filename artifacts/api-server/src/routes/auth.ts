import { Router, type IRouter } from "express";
import { supabaseAdmin } from "../lib/supabase";

const router: IRouter = Router();

async function getBearerUser(req: any) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return null;

  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) return null;
  return user;
}

router.post("/auth/signup", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password required" });
    return;
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name: name || "" },
  });

  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  let profileErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    const { error } = await supabaseAdmin.from("profiles").upsert({
      id: data.user.id,
      email,
      name: name || "",
      plan: "traveller",
    });
    profileErr = error;
    if (!error) break;
    await new Promise(r => setTimeout(r, 200));
  }
  if (profileErr) {
    console.warn("Profile upsert failed:", profileErr.message);
  }

  const { data: session, error: signInErr } =
    await supabaseAdmin.auth.signInWithPassword({ email, password });
  if (signInErr) {
    res.status(400).json({ error: signInErr.message });
    return;
  }

  res.json({
    user: data.user,
    session: session.session,
  });
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password required" });
    return;
  }

  const { data, error } = await supabaseAdmin.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  res.json({
    user: data.user,
    session: data.session,
  });
});

router.get("/auth/me", async (req, res) => {
  const user = await getBearerUser(req);
  if (!user) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  res.json({ user, profile });
});

router.get("/auth/telnyx-token", async (req, res) => {
  const user = await getBearerUser(req);
  if (!user) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  const apiKey = process.env.TELNYX_API_KEY;
  const credentialId = process.env.TELNYX_TELEPHONY_CREDENTIAL_ID;
  if (!apiKey || !credentialId) {
    res.status(500).json({ error: "Telnyx credentials are not configured" });
    return;
  }

  try {
    const tokenRes = await fetch(`https://api.telnyx.com/v2/telephony_credentials/${credentialId}/token`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    const raw: any = await tokenRes.json().catch(() => ({}));
    const loginToken = raw?.data?.token;

    if (!tokenRes.ok || !loginToken) {
      const detail = raw?.errors?.[0]?.detail || raw?.errors?.[0]?.title || "Token generation failed";
      res.status(502).json({ error: detail });
      return;
    }

    const { data: pushTokens } = await supabaseAdmin
      .from("user_push_tokens")
      .select("ios_voip_token, android_fcm_token, updated_at")
      .eq("user_id", user.id)
      .maybeSingle();

    res.json({
      login_token: loginToken,
      expires_in: raw?.data?.expires_in ?? 3600,
      push_tokens: pushTokens ?? null,
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Unable to generate Telnyx token" });
  }
});

router.get("/auth/push-tokens", async (req, res) => {
  const user = await getBearerUser(req);
  if (!user) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  const { data, error } = await supabaseAdmin
    .from("user_push_tokens")
    .select("user_id, ios_voip_token, android_fcm_token, updated_at")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json({ push_tokens: data ?? null });
});

router.post("/auth/push-tokens", async (req, res) => {
  const user = await getBearerUser(req);
  if (!user) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  const { ios_voip_token, android_fcm_token } = req.body || {};
  const payload = {
    user_id: user.id,
    ios_voip_token: ios_voip_token ?? null,
    android_fcm_token: android_fcm_token ?? null,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseAdmin
    .from("user_push_tokens")
    .upsert(payload, { onConflict: "user_id" })
    .select("user_id, ios_voip_token, android_fcm_token, updated_at")
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json({ push_tokens: data });
});

export default router;
