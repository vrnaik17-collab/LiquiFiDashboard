#!/bin/bash
# Deploy Supabase Edge Function for OTP email delivery

echo "🚀 Deploying OTP Email Function to Supabase..."
echo ""
echo "Prerequisites:"
echo "✓ Supabase CLI installed (npm install -g supabase)"
echo "✓ You're logged in to Supabase (supabase login)"
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Install it with:"
    echo "   npm install -g supabase"
    exit 1
fi

# Step 1: Initialize Supabase project locally (if not already done)
if [ ! -d "supabase" ]; then
    echo "📁 Initializing Supabase project..."
    supabase init
fi

# Step 2: Set environment variable
echo ""
echo "🔑 Setting RESEND_API_KEY in Supabase..."
echo "   (You can also set this manually in Supabase Dashboard → Functions → Environment Variables)"
read -p "Press Enter when ready to deploy, or Ctrl+C to set environment variables manually first"

# Step 3: Deploy the function
echo ""
echo "📤 Deploying send-otp-email function..."
supabase functions deploy send-otp-email

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Function deployed successfully!"
    echo ""
    echo "📝 Next Steps:"
    echo "1. Set RESEND_API_KEY environment variable:"
    echo "   - Go to Supabase Dashboard → Project → Functions"
    echo "   - Click 'send-otp-email'"
    echo "   - Click 'Settings'"
    echo "   - Add environment variable: RESEND_API_KEY = re_YOUR_API_KEY"
    echo ""
    echo "2. Test the function:"
    echo "   curl -X POST https://lnyvzwiytskkdbtdapzn.supabase.co/functions/v1/send-otp-email \\"
    echo "     -H 'Authorization: Bearer YOUR_ANON_KEY' \\"
    echo "     -H 'Content-Type: application/json' \\"
    echo "     -d '{\"email\":\"test@example.com\",\"otp_code\":\"123456\",\"expiry_minutes\":5}'"
else
    echo ""
    echo "❌ Deployment failed. Check the error above."
    exit 1
fi
