import axios from 'axios';
import twilio from 'twilio';

const twilioClient = process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN 
  ? twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

export const MessagingService = {
  /**
   * Send a WhatsApp template message via Meta Cloud API
   */
  async sendWhatsAppNotification(to: string, taskDetails: { id: string; category: string; date: string }) {
    if (!process.env.WA_PHONE_NUMBER_ID || !process.env.WA_ACCESS_TOKEN) {
      console.log(`[MOCK WA] To: ${to}, Template: task_alert, ID: ${taskDetails.id}`);
      return;
    }

    try {
      const url = `https://graph.facebook.com/v18.0/${process.env.WA_PHONE_NUMBER_ID}/messages`;
      await axios.post(url, {
        messaging_product: "whatsapp",
        to: to.replace('+', ''),
        type: "template",
        template: {
          name: "mandal_task_alert", // Must be created in Meta Portal
          language: { code: "en_US" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: taskDetails.category },
                { type: "text", text: taskDetails.date }
              ]
            },
            {
              type: "button",
              sub_type: "quick_reply",
              index: 0,
              parameters: [{ type: "text", text: taskDetails.id }]
            }
          ]
        }
      }, {
        headers: { Authorization: `Bearer ${process.env.WA_ACCESS_TOKEN}` }
      });
      console.log(`[WA] Alert sent to ${to}`);
    } catch (error: any) {
      console.error(`[WA ERROR] ${error.response?.data?.error?.message || error.message}`);
    }
  },

  /**
   * Send a standard SMS via Twilio
   */
  async sendSMS(to: string, body: string) {
    if (!twilioClient || !process.env.TWILIO_PHONE) {
      console.log(`[MOCK SMS] To: ${to}, Body: ${body}`);
      return;
    }

    try {
      await twilioClient.messages.create({
        body,
        to,
        from: process.env.TWILIO_PHONE
      });
      console.log(`[SMS] Sent to ${to}`);
    } catch (error: any) {
      console.error(`[SMS ERROR] ${error.message}`);
    }
  }
};
