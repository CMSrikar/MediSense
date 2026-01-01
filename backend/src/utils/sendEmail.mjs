import nodemailer from "nodemailer";

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async ({
  lat,
  lng,
  userEmail = process.env.USER_EMAIL,
  emergencyEmail = process.env.EMERGENCY_EMAIL,
  adminEmail = process.env.ADMIN_EMAIL,
}) => {
  console.log("EMAILS:", userEmail, emergencyEmail, adminEmail);

  const locationLink = `https://www.google.com/maps?q=${lat},${lng}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: [userEmail, emergencyEmail, adminEmail].filter(Boolean),
    subject: "🚨 SOS EMERGENCY ALERT",
    text: `Emergency detected!\n\nLocation:\n${locationLink}`,
  };

  console.log("Sending email to:", mailOptions.to);

  await transporter.sendMail(mailOptions);
  console.log("✅ Emails sent successfully");
};
