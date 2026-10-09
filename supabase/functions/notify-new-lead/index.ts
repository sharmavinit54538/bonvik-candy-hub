// Supabase Edge Function: notify-new-lead
// Developed for Bonvik Foods / Equinoxsphere
// Sends Email and WhatsApp notifications to team when a new lead or partner application is submitted

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadPayload {
  name: string;
  company?: string;
  email: string;
  phone: string;
  subject?: string;
  message?: string;
  source: string;
  location?: string;
  details?: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload: LeadPayload = await req.json();

    const recipientEmail = Deno.env.get("NOTIFICATION_EMAIL") || "Bonvikfoods@gmail.com";
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioWhatsappFrom = Deno.env.get("TWILIO_WHATSAPP_FROM"); // e.g. "whatsapp:+14155238886"
    const teamWhatsappNumber = Deno.env.get("TEAM_WHATSAPP_NUMBER"); // e.g. "whatsapp:+919988827786"
    const webhookUrl = Deno.env.get("TEAM_WEBHOOK_URL"); // Optional Slack/Discord/Custom webhook

    console.log(`[Notification] New lead received from ${payload.name} (${payload.source})`);

    const summaryText = `
🍬 New Bonvik Foods Lead Received!
---------------------------------------
Source: ${payload.source}
Name: ${payload.name}
Company: ${payload.company || "N/A"}
Email: ${payload.email}
Phone: ${payload.phone}
Subject: ${payload.subject || "N/A"}
Message:
${payload.message || "N/A"}
---------------------------------------
Timestamp: ${new Date().toISOString()}
    `.trim();

    // 1. Send Email via Resend if API key is present
    if (resendApiKey) {
      try {
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Bonvik Leads <leads@bonvikfoods.com>",
            to: [recipientEmail],
            subject: `[New Lead - ${payload.source}] ${payload.name} (${payload.company || payload.phone})`,
            text: summaryText,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
                <h2 style="color: #FF2E4D; margin-bottom: 4px;">🍬 New Lead Received</h2>
                <p style="color: #666; font-size: 13px; margin-top: 0;">Source: <strong>${payload.source}</strong></p>
                <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; margin: 16px 0;">
                  <p style="margin: 4px 0;"><strong>Name:</strong> ${payload.name}</p>
                  <p style="margin: 4px 0;"><strong>Company:</strong> ${payload.company || "N/A"}</p>
                  <p style="margin: 4px 0;"><strong>Email:</strong> <a href="mailto:${payload.email}">${payload.email}</a></p>
                  <p style="margin: 4px 0;"><strong>Phone:</strong> <a href="tel:${payload.phone}">${payload.phone}</a></p>
                  <p style="margin: 4px 0;"><strong>Subject:</strong> ${payload.subject || "N/A"}</p>
                </div>
                <h4 style="margin-bottom: 4px;">Message / Details:</h4>
                <div style="background: #fff; border: 1px solid #eee; padding: 12px; border-radius: 6px; white-space: pre-wrap; font-size: 14px;">${payload.message || "N/A"}</div>
                <p style="color: #999; font-size: 11px; margin-top: 24px;">Equinoxsphere Bonvik Foods CRM Notification</p>
              </div>
            `,
          }),
        });
        console.log("[Resend Email Status]", emailRes.status);
      } catch (err) {
        console.error("[Resend Email Error]", err);
      }
    }

    // 2. Send WhatsApp via Twilio if configured
    if (twilioAccountSid && twilioAuthToken && twilioWhatsappFrom && teamWhatsappNumber) {
      try {
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
        const body = new URLSearchParams();
        body.append("From", twilioWhatsappFrom);
        body.append("To", teamWhatsappNumber);
        body.append("Body", summaryText);

        const twilioRes = await fetch(twilioUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ` + btoa(`${twilioAccountSid}:${twilioAuthToken}`),
          },
          body: body.toString(),
        });
        console.log("[Twilio WhatsApp Status]", twilioRes.status);
      } catch (err) {
        console.error("[Twilio WhatsApp Error]", err);
      }
    }

    // 3. Webhook (Slack / Discord / Custom CRM webhook) if configured
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: summaryText,
            payload,
          }),
        });
      } catch (err) {
        console.error("[Webhook Error]", err);
      }
    }

    return new Response(JSON.stringify({ success: true, message: "Notification processed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[Notification Error]", error);
    return new Response(JSON.stringify({ success: false, error: (error as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
