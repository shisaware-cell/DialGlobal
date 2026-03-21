import { Router, type IRouter } from "express";
import { supabaseAdmin } from "../lib/supabase";
import { telnyx } from "../lib/telnyx";

const router: IRouter = Router();

async function getUserFromToken(token: string) {
  const {
    data: { user },
  } = await supabaseAdmin.auth.getUser(token);
  return user;
}

router.post("/calls/initiate", async (req, res) => {
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

  const { from_number, to_number } = req.body;
  if (!from_number || !to_number) {
    res.status(400).json({ error: "from_number, to_number required" });
    return;
  }

  try {
    const call = await telnyx.calls.dial({
      connection_id: process.env.TELNYX_CONNECTION_ID!,
      to: to_number,
      from: from_number,
    });

    const { data: numRow } = await supabaseAdmin
      .from("virtual_numbers")
      .select("id")
      .eq("phone_number", from_number)
      .eq("user_id", user.id)
      .single();

    const { data, error } = await supabaseAdmin
      .from("calls")
      .insert({
        user_id: user.id,
        number_id: numRow?.id || null,
        from_number,
        to_number,
        direction: "outbound",
        status: "initiated",
        telnyx_call_id: (call.data as any)?.call_control_id || null,
      })
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ call: data });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to initiate call" });
  }
});

router.get("/calls", async (req, res) => {
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

  const { data, error } = await supabaseAdmin
    .from("calls")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json({ calls: data || [] });
});

export default router;
