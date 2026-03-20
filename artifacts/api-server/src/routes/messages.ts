import { Router, type IRouter } from "express";
import { supabaseAdmin } from "../lib/supabase";
import { telnyx, messagingProfileId } from "../lib/telnyx";

const router: IRouter = Router();

async function getUserFromToken(token: string) {
  const {
    data: { user },
  } = await supabaseAdmin.auth.getUser(token);
  return user;
}

router.post("/messages/send", async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const user = await getUserFromToken(token);
  if (!user) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  const { from_number, to_number, body } = req.body;
  if (!from_number || !to_number || !body) {
    res.status(400).json({ error: "from_number, to_number, body required" });
    return;
  }

  try {
    const msg = await telnyx.messages.create({
      from: from_number,
      to: to_number,
      text: body,
      messaging_profile_id: messagingProfileId,
    });

    const { data: numRow } = await supabaseAdmin
      .from("virtual_numbers")
      .select("id")
      .eq("phone_number", from_number)
      .eq("user_id", user.id)
      .single();

    const { data, error } = await supabaseAdmin
      .from("messages")
      .insert({
        user_id: user.id,
        number_id: numRow?.id || null,
        from_number,
        to_number,
        body,
        direction: "outbound",
        status: "sent",
        telnyx_message_id: (msg.data as any)?.id || null,
      })
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    await supabaseAdmin
      .from("virtual_numbers")
      .update({ sms_count: numRow ? undefined : 0 })
      .eq("id", numRow?.id || "");

    await supabaseAdmin.rpc("increment_sms", { num_id: numRow?.id });

    res.json({ message: data });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to send" });
  }
});

router.get("/messages", async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const user = await getUserFromToken(token);
  if (!user) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  const { number_id } = req.query;

  let query = supabaseAdmin
    .from("messages")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (number_id) {
    query = query.eq("number_id", number_id as string);
  }

  const { data, error } = await query.limit(100);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json({ messages: data || [] });
});

router.get("/messages/threads", async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const user = await getUserFromToken(token);
  if (!user) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  const { data, error } = await supabaseAdmin.rpc("get_message_threads", {
    p_user_id: user.id,
  });

  if (error) {
    const { data: fallback } = await supabaseAdmin
      .from("messages")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    res.json({ threads: fallback || [] });
    return;
  }

  res.json({ threads: data || [] });
});

export default router;
