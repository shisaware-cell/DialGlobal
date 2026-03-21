import { Router, type IRouter } from "express";
import { supabaseAdmin } from "../lib/supabase";

const router: IRouter = Router();

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
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ error: "No token" });
    return;
  }

  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) {
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

export default router;
