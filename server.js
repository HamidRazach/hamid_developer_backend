const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "hamidraza7614@gmail.com", // Replace with your Gmail address
        pass: "zyca pqrz fcoj lfeb", // Replace with your Gmail app-specific password
    },
    debug: true, // Enable debug mode
    logger: true, // Log messages
});

// Function to create the email template
const createTemplate = (title, content) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
    <div style="background-color: #4caf50; color: white; padding: 20px; text-align: center;">
      <h1>${title}</h1>
    </div>
    <div style="padding: 20px;">
      ${content}
    </div>
    <div style="background-color: #f9f9f9; color: #777; text-align: center; padding: 10px 20px;">
      <p>Thank you for choosing us!</p>
      <p style="margin: 0;">&copy; ${new Date().getFullYear()} M Hamid Raza All rights reserved.</p>
    </div>
  </div>
`;

// Route to handle contact form submission
app.post("/send-email", (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !subject || !message) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Email to admin
    const adminEmailOptions = {
        from: `"Contact Form" <${email}>`, // Sender email
        to: "hamidraza7614@gmail.com", // Your email address to receive messages
        subject: `New Contact Form Submission: ${subject}`,
        html: createTemplate(
            "New Contact Form Submission",
            `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <p>Hello Hamid,</p>
                <p>You have received a new message from the contact form on your website. Here are the details:</p>
                <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
                    <tr>
                        <th style="text-align: left; border-bottom: 1px solid #ddd; padding: 8px;">Field</th>
                        <th style="text-align: left; border-bottom: 1px solid #ddd; padding: 8px;">Details</th>
                    </tr>
                    <tr>
                        <td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>Name:</strong></td>
                        <td style="border-bottom: 1px solid #ddd; padding: 8px;">${name}</td>
                    </tr>
                    <tr>
                        <td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>Email:</strong></td>
                        <td style="border-bottom: 1px solid #ddd; padding: 8px;">${email}</td>
                    </tr>
                    <tr>
                        <td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>Phone:</strong></td>
                        <td style="border-bottom: 1px solid #ddd; padding: 8px;">${phone}</td>
                    </tr>
                    <tr>
                        <td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>Subject:</strong></td>
                        <td style="border-bottom: 1px solid #ddd; padding: 8px;">${subject}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; vertical-align: top;"><strong>Message:</strong></td>
                        <td style="padding: 8px; vertical-align: top;">${message}</td>
                    </tr>
                </table>
                <p style="margin-top: 20px;">Please respond to this inquiry at your earliest convenience.</p>
            </div>
            `
        ),
    };

    // Thank-you email to the user
    const userEmailOptions = {
        from: "hamidraza7614@gmail.com", // Your email address
        to: email, // User's email address
        subject: "Thank You for Reaching Out!",
        html: createTemplate(
            "Thank You!",
            `
            <p>Dear ${name},</p>
            <p>Thank you for contacting us! We have received your message and will get back to you as soon as possible.</p>
            <p>If you have any urgent queries, feel free to reply to this email or call us directly at +923227588875.</p>
            <p>Have a great day!</p>
            `
        ),
    };

    // Send both emails
    Promise.all([
        transporter.sendMail(adminEmailOptions),
        transporter.sendMail(userEmailOptions),
    ])
        .then(() => {
            res.status(200).json({ success: true, message: "Emails sent successfully!" });
        })
        .catch((error) => {
            console.error("Error sending emails:", error);
            res.status(500).json({ success: false, message: "Failed to send emails." });
        });
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
