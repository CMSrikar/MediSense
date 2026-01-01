import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this to another service if needed
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.warn("⚠️  Email Service Warning: Unable to connect to email server.");
    console.warn("   Make sure EMAIL_USER and EMAIL_PASS are set in your .env file.");
    console.warn("   Error:", error.message);
  } else {
    console.log("✅ Email Service is ready to send messages");
  }
});

export const sendOrderReceipt = async (order, customerEmail) => {
  // Keeping this for compatibility if imported, but not used in Lab Test System directly unless needed
  return null;
};

// Send Test Booking Confirmation Email
export const sendTestBookingReceipt = async (booking) => {
  if (!booking.email) return;

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: booking.email,
    subject: `Booking Confirmed - ID: ${booking._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Test Booking Confirmation</h2>
        <p>Dear ${booking.patientName},</p>
        <p>Your appointment has been successfully booked!</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Booking ID:</strong> ${booking._id}</p>
          <p><strong>Lab Name:</strong> ${booking.labName}</p>
          <p><strong>Date:</strong> ${new Date(booking.preferredDate).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${booking.timeSlot}</p>
          <p><strong>Location:</strong> ${booking.address}</p>
        </div>

        <h3>Tests Scheduled:</h3>
        <ul>
          ${booking.tests
        .map(
          (test) => `
            <li>
              <strong>${test.name}</strong> - ₹${test.price}
            </li>
          `
        )
        .join("")}
        </ul>
        
        <p style="font-size: 1.2em; font-weight: bold; margin-top: 20px;">
          Total Amount: ₹${booking.tests.reduce((sum, item) => sum + item.price, 0)}
        </p>

        <p style="color: #666; font-size: 0.9em; margin-top: 30px;">
          If you have any questions, please contact the lab directly.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Test Booking Receipt sent to:", booking.email);
  } catch (error) {
    console.error("❌ Error sending booking receipt:", error);
  }
};
