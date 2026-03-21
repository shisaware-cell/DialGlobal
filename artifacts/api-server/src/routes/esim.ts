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

router.post("/esim/order", async (req, res) => {
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

  const { plan_id, region, data_gb, days, price } = req.body;

  try {
    const order = await (telnyx as any).simCardOrders.create({
      quantity: 1,
      type: "eSIM",
    });

    const orderData = order.data as any;
    const orderId = orderData?.id;

    const simCards: any[] = orderData?.sim_cards || [];
    let activationCode: string | null = null;

    if (simCards.length > 0) {
      try {
        const simCardId = simCards[0].id;
        const codeRes = await (telnyx as any).simCards.getActivationCode(simCardId);
        activationCode = (codeRes.data as any)?.activation_code || null;
      } catch {
      }
    }

    res.json({
      order_id: orderId,
      status: orderData?.status || "processing",
      activation_code: activationCode,
      sim_cards: simCards,
    });
  } catch (err: any) {
    const msg = err?.errors?.[0]?.detail || err?.message || "Failed to order eSIM";
    res.status(500).json({ error: msg });
  }
});

router.get("/esim/:simCardId/code", async (req, res) => {
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

  try {
    const codeRes = await (telnyx as any).simCards.getActivationCode(req.params.simCardId);
    const activationCode = (codeRes.data as any)?.activation_code;
    res.json({ activation_code: activationCode });
  } catch (err: any) {
    const msg = err?.errors?.[0]?.detail || err?.message || "Failed to get activation code";
    res.status(500).json({ error: msg });
  }
});

export default router;
