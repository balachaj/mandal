# Messaging Setup Guide (Phase 2)

## 📱 WhatsApp Cloud API (Free Tier)
Meta provides 1,000 free conversations per month.

1.  **Meta Developer Portal**: Go to [developers.facebook.com](https://developers.facebook.com/) and create a **Business** App.
2.  **Add WhatsApp**: Add the WhatsApp product to your app.
3.  **Get Credentials**:
    *   `WA_PHONE_NUMBER_ID`: Found in the WhatsApp "Getting Started" tab.
    *   `WA_ACCESS_TOKEN`: Use a Permanent Access Token (generated via System User in Business Settings).
    *   `WA_VERIFY_TOKEN`: A random string you define for the webhook handshake.
4.  **Configure Webhook**:
    *   Callback URL: `https://<your-domain>/api/webhooks/whatsapp`
    *   Verify Token: (Same as `WA_VERIFY_TOKEN`)
    *   Fields to subscribe: `messages`
5.  **Create Template**:
    *   Name: `mandal_task_alert`
    *   Body: `Mandal Alert: {{1}} needed on {{2}}.`
    *   Buttons: Quick Reply -> Payload: `{{3}}`

## 💬 Twilio SMS (Optional/Backup)
1.  Get your `TWILIO_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_PHONE`.
2.  Configure the Twilio Webhook URL to: `https://<your-domain>/api/webhooks/messaging`

## ⚙️ Environment Variables
Update your `mandal/server/.env`:
```env
WA_PHONE_NUMBER_ID="your_id"
WA_ACCESS_TOKEN="your_token"
WA_VERIFY_TOKEN="your_random_string"

TWILIO_SID="your_sid"
TWILIO_AUTH_TOKEN="your_token"
TWILIO_PHONE="+1234567890"
```
