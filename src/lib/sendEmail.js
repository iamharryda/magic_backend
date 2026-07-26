import nodemailer from "nodemailer";
import {
  emailHost,
  emailPort,
  emailAddress,
  emailPass,
  emailFrom,
} from "../core/config/config.js"; 

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: emailHost,
      port: emailPort,
      secure: false,
      auth: {
        user: emailAddress,
        pass: emailPass,
      },
    });

    const plainText = html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>|<\/div>|<\/h[1-6]>/gi, '\n\n')
      .replace(/<[^>]+>/g, '')
      .replace(/\n\s*\n/g, '\n\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    const mailOptions = {
      from: `"Magic Initiative" <${emailFrom}>`,
      replyTo: emailFrom,
      to,
      subject,
      text: plainText,
      html,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error: error.message };
  }
};

export default sendEmail;
