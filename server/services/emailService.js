import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = (to, downloadLink) => {
  const mailOptions = {
    from: `"Your Company Name" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Secure Ebook Download Link",
    html: `
      <div style="font-family: Arial, sans-serif; color: #2c3e50; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #ddd; padding: 30px; border-radius: 8px;">
          <h2 style="color: #003366; border-bottom: 1px solid #ccc; padding-bottom: 10px;">Ebook Purchase Confirmation</h2>
          <p>Dear Customer,</p>
          <p>We appreciate your recent purchase. Please find your secure ebook download link below:</p>
          <p style="margin: 20px 0;">
            <a href="${downloadLink}" style="background-color: #004080; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Download Ebook</a>
          </p>
          <p>If you did not make this purchase or believe this message was sent in error, please contact our support team immediately.</p>
          <hr style="margin: 30px 0;">
          <p style="font-size: 12px; color: #666;">
            This is an automatically generated message. Please do not reply to this email.<br>
            © ${new Date().getFullYear()} Your Company Name. All rights reserved.
          </p>
        </div>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log("❌ Email error:", error);
    else console.log("✅ Email sent:", info.response);
  });
};

export default sendEmail;
