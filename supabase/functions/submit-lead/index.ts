// @ts-nocheck
// Supabase Edge Function: verify Cloudflare Turnstile, then insert lead.
// Set TURNSTILE_SECRET_KEY in Supabase Dashboard → Project Settings → Edge Functions → Secrets.

import { createClient } from "npm:@supabase/supabase-js@2";

const allowedOrigin = Deno.env.get("ALLOWED_ORIGIN") ?? "*";
const corsHeaders = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ParentPayload {
  type: "parent";
  turnstileToken: string;
  honeypot?: string;
  name: string;
  email: string;
  phone: string;
  zip: string;
  numStudents: string;
  relationship: string;
}

interface TutorPayload {
  type: "tutor";
  turnstileToken: string;
  honeypot?: string;
  name: string;
  email: string;
  school: string;
  graduatingYear: string;
  resumePath?: string | null;
}

type Payload = ParentPayload | TutorPayload;

async function verifyTurnstile(token: string, remoteip?: string): Promise<boolean> {
  const secret = Deno.env.get("TURNSTILE_SECRET_KEY");
  if (!secret) {
    throw new Error("TURNSTILE_SECRET_KEY is not configured");
  }
  const body = new URLSearchParams({ secret, response: token });
  if (remoteip) body.set("remoteip", remoteip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  const data = await res.json();
  console.log("Turnstile siteverify:", JSON.stringify(data));
  return data?.success === true;
}

function splitName(full: string): { first_name: string; last_name: string } {
  const trimmed = full.trim();
  const space = trimmed.indexOf(" ");
  if (space <= 0) return { first_name: trimmed || "—", last_name: "—" };
  return {
    first_name: trimmed.slice(0, space).trim(),
    last_name: trimmed.slice(space).trim(),
  };
}


Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let payload: Payload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Honeypot: if filled, treat as bot
  if (payload.honeypot && String(payload.honeypot).trim() !== "") {
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const token = payload.turnstileToken;
  if (!token || typeof token !== "string") {
    return new Response(JSON.stringify({ error: "Missing Turnstile token" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const clientIp = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for") ?? undefined;
  let valid: boolean;
  try {
    valid = await verifyTurnstile(token, clientIp);
  } catch (err) {
    console.error("Turnstile error:", err);
    return new Response(JSON.stringify({ error: "Server misconfiguration" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!valid) {
    return new Response(JSON.stringify({ error: "Captcha verification failed" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set");
    return new Response(JSON.stringify({ error: "Server misconfiguration" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  if (payload.type === "parent") {
    const { first_name, last_name } = splitName(payload.name);
    const { error } = await supabase.from("parent_applications").insert({
      first_name,
      last_name,
      email: payload.email.trim(),
      phone: payload.phone?.trim() || null,
      zip_code: payload.zip?.trim() || null,
      num_students: payload.numStudents || null,
      relationship: payload.relationship?.trim() || "parent",
    });
    if (error) {
      if (error.code === "23505") {
        return new Response(JSON.stringify({ error: "We already have your information on file! We'll be in touch soon." }), {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      console.error("parent_applications insert error:", error);
      return new Response(JSON.stringify({ error: "Failed to submit" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } else if (payload.type === "tutor") {
    const { first_name: first, last_name: last } = splitName(payload.name.trim());
    const gy = payload.graduatingYear.trim();
    const gradYear =
      gy === "graduated" || !gy ? null : `${gy}-06-01`;
    const { error } = await supabase.from("applications").insert({
      first_name: first || null,
      last_name: last || null,
      email: payload.email.trim() || null,
      school: payload.school.trim() || null,
      grad_year: gradYear,
      resume_path: payload.resumePath?.trim() || null,
    });
    if (error) {
      if (error.code === "23505") {
        return new Response(JSON.stringify({ error: "You've already applied! We'll review your application and reach out soon." }), {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      console.error("applications insert error:", error);
      return new Response(JSON.stringify({ error: "Failed to submit" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } else {
    return new Response(JSON.stringify({ error: "Invalid type" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
