import twilio from "twilio";
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const sendWhatsApp = (to, downloadLink) => {
  const messageBody = `
📘 *Ebook Purchase Confirmation*

Dear Customer,

Thank you for your purchase. You can securely download your ebook using the link below:

🔗 Download Link: ${downloadLink}

If you have any questions or did not authorize this transaction, please contact our support team.

_This is an automated message. Please do not reply._

— Your Company Name
`;

  client.messages
    .create({
      from: "whatsapp:+14155238886", // Twilio sandbox number
      to: `whatsapp:${to}`,
      body: messageBody.trim(),
    })
    .then((message) => console.log("✅ WhatsApp sent:", message.sid))
    .catch((err) => console.error("❌ WhatsApp send error:", err));
};

export default sendWhatsApp;
