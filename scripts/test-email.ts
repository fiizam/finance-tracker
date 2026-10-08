import 'dotenv/config';
import nodemailer from 'nodemailer';

async function verifyEmailConfig() {
  console.log("Checking email configuration...");
  console.log("SMTP_EMAIL:", process.env.SMTP_EMAIL ? process.env.SMTP_EMAIL : "MISSING");
  console.log("SMTP_PASSWORD:", process.env.SMTP_PASSWORD ? "SET (length: " + process.env.SMTP_PASSWORD.length + ")" : "MISSING");
  
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.error("Missing environment variables.");
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    await transporter.verify();
    console.log("✅ Server is ready to take our messages");
  } catch (error) {
    console.error("❌ Transporter verification failed:");
    console.error(error);
  }
}

verifyEmailConfig().catch(console.error);
