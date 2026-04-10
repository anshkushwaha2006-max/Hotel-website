# Salt Bay Resort - Contact Form Backend

A Node.js/Express backend for handling contact form submissions on the Salt Bay Resort website.

## Features

- ✅ Contact form processing with validation
- ✅ Email notifications to business email
- ✅ Auto-reply emails to customers
- ✅ CORS support for frontend integration
- ✅ Input validation and error handling
- ✅ Professional email templates

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Email Settings

Edit the `.env` file with your email credentials:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**For Gmail users:**
- Use your Gmail address for `EMAIL_USER`
- Generate an "App Password" at https://myaccount.google.com/apppasswords
- Use the app password (not your regular password) for `EMAIL_PASS`

**For other email providers:**
- Update the transporter configuration in `server.js`
- Use appropriate service settings (Outlook, Yahoo, etc.)

### 3. Start the Server

For development (with auto-restart):
```bash
npm run dev
```

For production:
```bash
npm start
```

The server will run on `http://localhost:3000`

## API Endpoints

### POST /api/contact
Handles contact form submissions.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1 (555) 123-4567",
  "enquiryType": "Reservation",
  "message": "I would like to book a room..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you for your enquiry! We'll get back to you within 24 hours."
}
```

### GET /api/health
Health check endpoint.

## File Structure

```
Portfolio/
├── server.js          # Main Express server
├── package.json       # Dependencies and scripts
├── .env              # Environment variables (email config)
├── index.html        # Frontend with contact form
├── hotel.css         # Styles
└── README.md         # This file
```

## Email Templates

The backend sends two emails for each form submission:

1. **Business Notification**: Sent to `stay@saltbay.com` with full enquiry details
2. **Customer Auto-Reply**: Confirmation email sent to the customer

## Security Notes

- Never commit the `.env` file to version control
- Use app passwords instead of regular email passwords
- The backend includes basic input validation
- Consider adding rate limiting for production use

## Troubleshooting

**Email not sending?**
- Check your email credentials in `.env`
- For Gmail, ensure you're using an App Password
- Check spam folder for test emails

**Form not submitting?**
- Ensure the server is running on port 3000
- Check browser console for JavaScript errors
- Verify all required fields are filled

**CORS errors?**
- The backend includes CORS middleware
- Make sure you're accessing from the correct domain

## Development

To modify the email templates, edit the HTML content in `server.js` in the `/api/contact` route.

For additional form fields, update:
1. The HTML form in `index.html`
2. The destructuring in `server.js`
3. The email templates in `server.js`