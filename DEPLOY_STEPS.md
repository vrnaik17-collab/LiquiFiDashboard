# 🚀 Deploy OTP Email Function to Supabase

Your Supabase Edge Function is ready! Follow these steps to deploy and activate it.

---

## Step 1️⃣: Install Supabase CLI (if not already installed)

```bash
npm install -g supabase
```

Verify installation:
```bash
supabase --version
```

---

## Step 2️⃣: Log in to Supabase

```bash
supabase login
```

This will open a browser window to authenticate. Follow the prompts.

---

## Step 3️⃣: Link Your Project

```bash
cd /workspaces/LiquiFiDashboard
supabase link --project-ref lnyvzwiytskkdbtdapzn
```

When prompted for password, enter your Supabase project password (or use your email + password).

---

## Step 4️⃣: Deploy the Function

```bash
supabase functions deploy send-otp-email
```

You should see:
```
✓ Function send-otp-email deployed successfully
   Endpoint: https://lnyvzwiytskkdbtdapzn.supabase.co/functions/v1/send-otp-email
```

---

## Step 5️⃣: Set Environment Variable in Supabase Dashboard

**Your Resend API Key:** `re_YNTSb4G3_Nt6FYw7nxpbaojsZa39f7xNg`

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: **lnyvzwiytskkdbtdapzn**
3. Go to **Functions** (left sidebar)
4. Click on **send-otp-email** function
5. Click **Settings** tab
6. Click **Add environment variable**
7. Set:
   - **Name:** `RESEND_API_KEY`
   - **Value:** `re_YNTSb4G3_Nt6FYw7nxpbaojsZa39f7xNg`
8. Click **Save**

---

## Step 6️⃣: Test the Function

### Option A: Test via Dashboard
1. In Supabase Dashboard, click the **send-otp-email** function
2. Click **Test** tab
3. In the "Invoke function" section, paste:
```json
{
  "email": "your-test-email@example.com",
  "otp_code": "123456",
  "expiry_minutes": 5
}
```
4. Click **Send**
5. You should receive an email with the OTP!

### Option B: Test via curl
```bash
curl -X POST https://lnyvzwiytskkdbtdapzn.supabase.co/functions/v1/send-otp-email \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxueXZ6d2l5dHNra2RidGRhcHpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NTI2MzcsImV4cCI6MjA5NjEyODYzN30.WvOjDRzBglM_v3YJ3J0CCVD-hQ8dL6FrZpqNi1Y5VRs" \
  -H "Content-Type: application/json" \
  -d '{
    "email":"your-email@example.com",
    "otp_code":"123456",
    "expiry_minutes":5
  }'
```

You should see a response:
```json
{
  "success": true,
  "messageId": "1234567890abcdef"
}
```

---

## Step 7️⃣: Verify Form Integration

Go to your form and:
1. Fill out Steps 1-3 completely
2. On Step 4, click **"Send Email OTP"**
3. Enter your real email address
4. Click the **"Send OTP"** button
5. **Check your inbox** — you should receive the OTP email!
6. Copy the 6-digit code and enter it in the form

---

## 🧪 Troubleshooting

### ❌ "Email not received"
- Check spam/promotions folder
- Verify Resend API key is correct in dashboard
- Check function logs in Supabase Dashboard → Functions → send-otp-email → Logs

### ❌ "Function deployment failed"
```bash
# Check that you're in the right directory
cd /workspaces/LiquiFiDashboard

# Re-link the project
supabase link --project-ref lnyvzwiytskkdbtdapzn

# Try deploying again
supabase functions deploy send-otp-email
```

### ❌ "401 Unauthorized" when testing
- Make sure you're using the correct anon key (from Supabase Dashboard → Project Settings → API)
- The function is public and doesn't require authentication

### ✅ "Email sent but OTP not working in form"
- Open DevTools (F12) → Console tab
- Fill the form and click "Send OTP"
- Check the network request to the Edge Function
- Make sure the frontend is calling the correct endpoint

---

## 📋 Checklist

- [ ] Supabase CLI installed and logged in
- [ ] Project linked locally (`supabase link`)
- [ ] Function deployed (`supabase functions deploy send-otp-email`)
- [ ] RESEND_API_KEY environment variable set in Supabase Dashboard
- [ ] Test email received from Resend
- [ ] Form sends OTP and user receives email
- [ ] OTP verification works end-to-end

---

## 🔐 Security Notes

- ✅ API key is **only** stored server-side in Supabase (not in frontend code)
- ✅ OTP codes are **not** logged in frontend console anymore
- ✅ RESEND_API_KEY is **not** exposed to users
- ✅ Function validates all inputs before sending

---

## 📞 Need Help?

- **Supabase Docs:** https://supabase.com/docs/guides/functions
- **Resend Docs:** https://resend.com/docs
- **Check Function Logs:** Supabase Dashboard → Functions → Logs tab

---

**Your Function is Ready!** Deploy it now with:
```bash
cd /workspaces/LiquiFiDashboard
supabase functions deploy send-otp-email
```
