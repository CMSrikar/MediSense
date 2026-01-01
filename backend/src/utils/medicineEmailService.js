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

transporter.verify(function (error, success) {
  if (error) {
    console.warn("⚠️  Medicine Email Service Warning: Unable to connect to email server.");
    console.warn("   Make sure EMAIL_USER and EMAIL_PASS are set in your .env file.");
    console.warn("   Error:", error.message);
  } else {
    console.log("✅ Medicine Email Service is ready to send orders");
  }
});

export const sendOrderReceipt = async (order, customerEmail) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: `Order Confirmation-SMARTMEDI`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Thank you for your order!</h2>
          <p>Hi ${order.customer.name},</p>
          <p>Your order has been placed successfully.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Total Amount:</strong> ₹${order.total.toFixed(2)}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
          </div>

          <h3>Order Items:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #eee;">
                <th style="padding: 10px; text-align: left;">Item</th>
                <th style="padding: 10px; text-align: right;">Qty</th>
                <th style="padding: 10px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr style="border-bottom: 1px solid #ddd;">
                  <td style="padding: 10px;">${item.name}</td>
                  <td style="padding: 10px; text-align: right;">${item.quantity}</td>
                  <td style="padding: 10px; text-align: right;">₹${item.price}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="margin-top: 20px; text-align: right;">
            <p><strong>Subtotal:</strong> ₹${order.subtotal.toFixed(2)}</p>
            <p><strong>Tax:</strong> ₹${order.tax.toFixed(2)}</p>
            <p><strong>Delivery Fee:</strong> ₹${order.deliveryFee.toFixed(2)}</p>
            <h3 style="color: #2c3e50;">Total: ₹${order.total.toFixed(2)}</h3>
          </div>

          <p style="margin-top: 30px; font-size: 12px; color: #7f8c8d;">
            If you have any questions, please contact our support team.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    // Don't throw error to avoid failing the order creation if email fails
    return null;
  }
};
