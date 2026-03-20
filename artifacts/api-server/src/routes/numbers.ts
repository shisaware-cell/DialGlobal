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

router.get("/numbers/search", async (req, res) => {
  const { country_code = "US", limit = "10" } = req.query;

  try {
    const result = await telnyx.availablePhoneNumbers.list({
      filter: {
        country_code: country_code as string,
        limit: parseInt(limit as string),
        features: ["sms", "voice"],
      },
    });

    const numbers = (result.data || []).map((n: any) => ({
      number: n.phone_number,
      country_code: n.region_information?.[0]?.region_type === "country_code" 
        ? n.region_information[0].region_name 
        : country_code,
      monthly_cost: n.cost_information?.monthly_cost || "1.00",
      features: n.features || [],
    }));

    res.json({ numbers });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to search numbers" });
  }
});

router.post("/numbers/provision", async (req, res) => {
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

  const { phone_number, country, country_code, flag } = req.body;
  if (!phone_number) {
    res.status(400).json({ error: "phone_number required" });
    return;
  }

  try {
    const order = await telnyx.phoneNumberOrders.create({
      phone_numbers: [{ phone_number }],
      connection_id: process.env.TELNYX_CONNECTION_ID || undefined,
      messaging_profile_id: messagingProfileId,
    });

    const { data, error } = await supabaseAdmin
      .from("virtual_numbers")
      .insert({
        user_id: user.id,
        phone_number,
        country: country || "United States",
        country_code: country_code || "US",
        flag: flag || "🇺🇸",
        type: "permanent",
        telnyx_order_id: (order.data as any)?.id || null,
        status: "active",
      })
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ number: data });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to provision number" });
  }
});

router.get("/numbers", async (req, res) => {
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
    .from("virtual_numbers")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json({ numbers: data || [] });
});

router.delete("/numbers/:id", async (req, res) => {
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

  const { error } = await supabaseAdmin
    .from("virtual_numbers")
    .delete()
    .eq("id", req.params.id)
    .eq("user_id", user.id);

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.json({ success: true });
});

export default router;
