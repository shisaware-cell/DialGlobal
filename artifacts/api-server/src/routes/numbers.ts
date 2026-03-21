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

async function releaseFromTelnyx(phoneNumber: string) {
  try {
    await telnyx.phoneNumbers.delete(phoneNumber as any);
    console.log(`Released ${phoneNumber} from Telnyx`);
  } catch (err: any) {
    console.warn(`Telnyx release failed for ${phoneNumber}:`, err.message || err);
  }
}

async function cleanupExpiredNumbers() {
  const now = new Date().toISOString();
  const { data: expired } = await supabaseAdmin
    .from("virtual_numbers")
    .select("id, phone_number")
    .not("expires_at", "is", null)
    .lt("expires_at", now)
    .eq("status", "active");

  if (!expired || expired.length === 0) return;

  for (const num of expired) {
    await releaseFromTelnyx(num.phone_number);
    await supabaseAdmin
      .from("virtual_numbers")
      .update({ status: "expired" })
      .eq("id", num.id);
    console.log(`Expired and released number ${num.phone_number}`);
  }
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

  const { phone_number, country, country_code, flag, trial_days } = req.body;
  if (!phone_number) {
    res.status(400).json({ error: "phone_number required" });
    return;
  }

  const expiresAt = trial_days && Number(trial_days) > 0
    ? new Date(Date.now() + Number(trial_days) * 86400000).toISOString()
    : null;

  try {
    const order = await telnyx.numberOrders.create({
      phone_numbers: [{ phone_number }],
      connection_id: process.env.TELNYX_CONNECTION_ID || undefined,
      messaging_profile_id: messagingProfileId,
    } as any);

    const orderData = order.data as any;
    const orderId = orderData?.id || null;
    const fullPhoneNumber =
      orderData?.phone_numbers?.[0]?.phone_number ||
      phone_number;

    const { data, error } = await supabaseAdmin
      .from("virtual_numbers")
      .insert({
        user_id: user.id,
        phone_number: fullPhoneNumber,
        country: country || "United States",
        country_code: country_code || "US",
        flag: flag || "🇺🇸",
        type: expiresAt ? "trial" : "permanent",
        telnyx_order_id: orderId,
        status: "active",
        expires_at: expiresAt,
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

  cleanupExpiredNumbers().catch(console.error);

  const { data, error } = await supabaseAdmin
    .from("virtual_numbers")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
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

  const { data: numRow } = await supabaseAdmin
    .from("virtual_numbers")
    .select("phone_number")
    .eq("id", req.params.id)
    .eq("user_id", user.id)
    .single();

  if (numRow?.phone_number) {
    await releaseFromTelnyx(numRow.phone_number);
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
