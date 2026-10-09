import { supabase } from "@/integrations/supabase/client";

export interface NotificationPayload {
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

export async function notifyNewLead(payload: NotificationPayload): Promise<void> {
  try {
    // Attempt invoking Supabase Edge Function
    const { error } = await supabase.functions.invoke("notify-new-lead", {
      body: payload,
    });

    if (error) {
      // Soft fail so client doesn't break if edge function is not deployed yet
      console.warn("[notifyNewLead] Edge function invocation note:", error.message || error);
    }
  } catch (err) {
    // Catch network / offline errors gracefully
    console.warn("[notifyNewLead] Notification skipped (offline or not configured):", err);
  }
}
