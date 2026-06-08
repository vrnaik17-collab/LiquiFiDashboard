import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

serve(async (req) => {
  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { 
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const { email, otp_code, expiry_minutes } = await req.json();

    // Validate inputs
    if (!email || !otp_code || !expiry_minutes) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: email, otp_code, expiry_minutes" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "RESEND_API_KEY not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Send email via Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "noreply@liquifi.in",
        to: email,
        subject: "Your LiquiFi Email Verification OTP",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 500px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                .otp-box { background: white; border: 2px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
                .otp-code { font-size: 48px; letter-spacing: 8px; color: #667eea; font-weight: bold; font-family: monospace; }
                .expiry { color: #666; font-size: 14px; margin: 15px 0; }
                .footer { color: #999; font-size: 12px; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 15px; }
                .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 10px; border-radius: 4px; margin: 15px 0; font-size: 14px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2 style="margin: 0;">LiquiFi</h2>
                  <p style="margin: 5px 0 0 0;">Email Verification</p>
                </div>
                
                <div class="content">
                  <p>Hello,</p>
                  
                  <p>You requested to verify your email address for your LiquiFi account. Use the OTP code below:</p>
                  
                  <div class="otp-box">
                    <div class="otp-code">${otp_code}</div>
                  </div>
                  
                  <div class="expiry">
                    ⏱️ This code expires in <strong>${expiry_minutes} minutes</strong>
                  </div>
                  
                  <div class="warning">
                    🔒 <strong>Security Notice:</strong> Never share this OTP with anyone. LiquiFi support will never ask for this code.
                  </div>
                  
                  <p>If you did not request this verification, please ignore this email or contact support immediately.</p>
                  
                  <div class="footer">
                    <p>© 2026 LiquiFi. All rights reserved.</p>
                    <p>This is an automated message, please do not reply to this email.</p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend API error:", data);
      return new Response(
        JSON.stringify({ error: data.message || "Failed to send email" }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log(`✅ OTP email sent to ${email} (Message ID: ${data.id})`);
    return new Response(
      JSON.stringify({ success: true, messageId: data.id }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error sending OTP:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
