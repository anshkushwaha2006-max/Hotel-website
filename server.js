const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.options('/api/contact', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, images)
app.use(express.static('.'));

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this to your email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Contact form submission endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, enquiryType, message } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Prepare email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'stay@saltbay.com', // Your business email
      subject: `New ${enquiryType} Enquiry from ${firstName} ${lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50; border-bottom: 2px solid #f39c12; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>

          <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h3 style="color: #34495e; margin-top: 0;">Customer Details:</h3>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Enquiry Type:</strong> ${enquiryType}</p>
          </div>

          <div style="background: #fff; border: 1px solid #dee2e6; padding: 20px; border-radius: 5px;">
            <h3 style="color: #34495e; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 12px;">
            <p>This enquiry was submitted via the Salt Bay Resort website contact form.</p>
          </div>
        </div>
      `,
      replyTo: email
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Auto-reply to customer
    const autoReplyOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting Salt Bay Resort',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Thank You for Your Enquiry</h2>

          <p>Dear ${firstName} ${lastName},</p>

          <p>Thank you for reaching out to Salt Bay Resort. We have received your ${enquiryType.toLowerCase()} enquiry and our team will review it shortly.</p>

          <p>One of our representatives will contact you within 24 hours to assist with your request.</p>

          <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h3 style="color: #34495e; margin-top: 0;">Your Enquiry Details:</h3>
            <p><strong>Enquiry Type:</strong> ${enquiryType}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <p>If you have any urgent questions, please don't hesitate to call us at +91 123 456 7890.</p>

          <p>Best regards,<br/>
          The Salt Bay Resort Team</p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 12px;">
            <p>Salt Bay Resort<br/>
            Cannaught Place, Delhi, India<br/>
            Email: stay@saltbay.com<br/>
            Phone: +91 123 456 7890</p>
          </div>
        </div>
      `
    };

    // Send auto-reply
    await transporter.sendMail(autoReplyOptions);

    res.json({
      success: true,
      message: 'Thank you for your enquiry! We\'ll get back to you within 24 hours.'
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({
      success: false,
      message: 'Sorry, there was an error processing your enquiry. Please try again or contact us directly.'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Salt Bay Resort API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Salt Bay Resort server is running on port ${PORT}`);
  console.log(`📧 Contact form endpoint: http://localhost:${PORT}/api/contact`);
  console.log(`🌐 Website: http://localhost:${PORT}/`);
});