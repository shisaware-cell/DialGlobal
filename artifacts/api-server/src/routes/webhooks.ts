import { Router, type IRouter } from "express";
import { supabaseAdmin } from "../lib/supabase";

const router: IRouter = Router();

router.post("/webhooks/telnyx", async (req, res) => {
  const event = req.body?.data;
  if (!event) {
    res.status(200).json({ ok: true });
    return;
  }

  const eventType = event.event_type;

  try {
    if (eventType === "message.received") {
      const payload = event.payload;
      const toNumber = payload.to?.[0]?.phone_number || payload.to;
      const fromNumber = payload.from?.phone_number || payload.from;
      const body = payload.text || "";

      const { data: numRow } = await supabaseAdmin
        .from("virtual_numbers")
        .select("id, user_id")
        .eq("phone_number", toNumber)
        .single();

      if (numRow) {
        await supabaseAdmin.from("messages").insert({
          user_id: numRow.user_id,
          number_id: numRow.id,
          from_number: fromNumber,
          to_number: toNumber,
          body,
          direction: "inbound",
          status: "delivered",
          telnyx_message_id: payload.id || null,
        });

        await supabaseAdmin.rpc("increment_sms", { num_id: numRow.id });
      }
    }

    if (
      eventType === "call.initiated" ||
      eventType === "call.answered" ||
      eventType === "call.hangup"
    ) {
      const payload = event.payload;
      const toNumber = payload.to;
      const fromNumber = payload.from;

      if (eventType === "call.initiated" && payload.direction === "incoming") {
        const { data: numRow } = await supabaseAdmin
          .from("virtual_numbers")
          .select("id, user_id")
          .eq("phone_number", toNumber)
          .single();

        if (numRow) {
          await supabaseAdmin.from("calls").insert({
            user_id: numRow.user_id,
            number_id: numRow.id,
            from_number: fromNumber,
            to_number: toNumber,
            direction: "inbound",
            status: "ringing",
            telnyx_call_id: payload.call_control_id || null,
          });

          await supabaseAdmin.rpc("increment_calls", { num_id: numRow.id });
        }
      }

      if (eventType === "call.hangup") {
        const callId = payload.call_control_id;
        if (callId) {
          const duration = payload.call_duration || 0;
          const wasAnswered = duration > 0;

          await supabaseAdmin
            .from("calls")
            .update({
              status: wasAnswered ? "completed" : "missed",
              duration,
              ended_at: new Date().toISOString(),
            })
            .eq("telnyx_call_id", callId);

          if (!wasAnswered) {
            const { data: callRow } = await supabaseAdmin
              .from("calls")
              .select("number_id")
              .eq("telnyx_call_id", callId)
              .single();

            if (callRow?.number_id) {
              await supabaseAdmin.rpc("increment_missed", {
                num_id: callRow.number_id,
              });
            }
          }
        }
      }
    }
  } catch (err: any) {
    console.error("Webhook error:", err.message);
  }

  res.status(200).json({ ok: true });
});

export default router;
