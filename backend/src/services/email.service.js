import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true', // true for 465
  auth: {
    user: process.env.EMAIL_USER,      // actual email login
    pass: process.env.EMAIL_PASSWORD,  // app password
  },
  tls: {
    rejectUnauthorized: false
  }
});

/**
 * Send email utility
 */
const sendEmail = async ({ to, subject, message }) => {
  try {
    await transporter.sendMail({
      from: `Smart Health <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      text: message,
    });

    console.log(`📧 Email sent to ${to}`);
  } catch (err) {
    console.error('❌ Email send failed:', err.message);
    throw new Error('Email could not be sent');
  }
};

export default sendEmail;
