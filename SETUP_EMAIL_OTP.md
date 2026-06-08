# 📧 Email OTP Setup Guide

The form now generates **real 6-digit OTP codes** and stores them in the browser. To **actually send emails**, choose one of these options:

---

## 🚀 Option 1: Supabase Edge Function + Resend (Recommended)

### Step 1: Create Resend Account
1. Go to [resend.com](https://resend.com) → Sign up (free)
2. Create an API key (you'll get a free tier with 100 emails/day)
3. Add a verified sender email

### Step 2: Create Supabase Edge Function
Create file: `supabase/functions/send-otp-email/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { email, otp_code, expiry_minutes } = await req.json();

    // Call Resend API to send email
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "noreply@liquifi.in", // Use your verified sender email
        to: email,
        subject: "Your LiquiFi Email Verification OTP",
        html: `
          <h2>Email Verification</h2>
          <p>Your One-Time Password (OTP) is:</p>
          <h1 style="color:#1a56ff;font-size:48px;letter-spacing:4px;">${otp_code}</h1>
          <p>This OTP will expire in <strong>${expiry_minutes} minutes</strong>.</p>
          <p style="color:#999;font-size:12px;">Do not share this OTP with anyone.</p>
          <p style="color:#999;font-size:12px;">If you did not request this, please ignore this email.</p>
        `,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return new Response(JSON.stringify({ error }), { status: response.status });
    }

    const data = await response.json();
    return new Response(JSON.stringify({ success: true, messageId: data.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
```

### Step 3: Set Environment Variables in Supabase
In your Supabase dashboard → Functions → Environment Variables:
```
RESEND_API_KEY=re_your_api_key_here
```

### Step 4: Deploy Function
```bash
supabase functions deploy send-otp-email
```

---

## 🔌 Option 2: Direct Resend API Integration

Modify the `sendOTPEmailViaSupabase()` function in `index.html`:

```javascript
async function sendOTPEmailViaSupabase(email, otpCode) {
  const RESEND_API_KEY = "re_your_api_key_here"; // Get from resend.com
  
  try {
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
          <h2>Email Verification</h2>
          <p>Your OTP is: <strong>${otpCode}</strong></p>
          <p>Expires in 5 minutes</p>
        `,
      }),
    });
    
    if (!response.ok) throw new Error("Resend API error");
    console.log("✅ OTP sent via Resend");
  } catch (e) {
    console.error("Email send failed:", e.message);
  }
}
```

⚠️ **Warning**: Don't hardcode API keys in frontend code. Use Edge Functions instead.

---

## 📝 Option 3: Use Your Own Email Service

Replace `sendOTPEmailViaSupabase()` to call your backend API:

```javascript
async function sendOTPEmailViaSupabase(email, otpCode) {
  const response = await fetch("https://your-backend.com/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp_code: otpCode }),
  });
  
  if (!response.ok) throw new Error("Failed to send OTP");
}
```

---

## 🧪 Testing Without Email Setup

For now, **OTP codes are logged in the browser console**:

1. Open DevTools: Press `F12` or `Ctrl+Shift+I`
2. Go to the **Console** tab
3. Fill the form and click "Send OTP"
4. Look for message: `📧 OTP for user@email.com: 123456 (expires in 5 min)`
5. Copy the 6-digit code and paste into the OTP verification field

---

## ✅ Production Checklist

- [ ] API keys stored in `.env` (never in code)
- [ ] Email sender domain verified with Resend/SendGrid
- [ ] Rate limiting enabled (max 5 OTP attempts)
- [ ] HTTPS enforced
- [ ] Email templates branded with LiquiFi logo
- [ ] Bounce/complaint handling configured

---

## 📚 Resources

- [Resend Documentation](https://resend.com/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [SendGrid Free Tier](https://sendgrid.com/pricing/)
- [Mailgun Free Tier](https://www.mailgun.com/pricing/)

---

Need help? Check the browser console (F12) for error messages.
