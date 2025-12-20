import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Adjust path to point to root .env (assuming script is in backend/src/scripts)
dotenv.config({ path: path.join(__dirname, '../../.env') });

console.log("Checking Email Configuration...");
console.log("EMAIL_HOST:", process.env.EMAIL_HOST || 'smtp.gmail.com');
console.log("EMAIL_PORT:", process.env.EMAIL_PORT || 587);
console.log("EMAIL_USER:", process.env.EMAIL_USER ? "******" + process.env.EMAIL_USER.slice(-5) : "NOT SET");
console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? "SET" : "NOT SET");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendTestEmail = async () => {
    try {
        console.log("Attempting to verify transporter connection...");
        await transporter.verify();
        console.log("✅ Transporter connection verified.");

        const testRecipient = process.env.EMAIL_USER; // Send to self
        console.log(`Attempting to send mail to: ${testRecipient}`);

        const info = await transporter.sendMail({
            from: `"Smart Health Test" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
            to: testRecipient,
            subject: "Test Email from SmartHealth Debugger",
            text: "If you receive this, your email configuration works!"
        });

        console.log("✅ Email sent successfully!");
        console.log("Message ID:", info.messageId);
    } catch (error) {
        console.error("❌ Email Error:", error);
        console.error("DETAILS:");
        console.error(JSON.stringify(error, null, 2));
    }
};

sendTestEmail();