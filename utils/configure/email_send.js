import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

// 1. Configure transporter
const Gmailtransporter = nodemailer.createTransport({
  service: "gmail", // or use "smtp.ethereal.email" for testing
  auth: {
    user: process.env.EMAIL,
    pass:process.env.APP_PASSWORD, // NOT your Gmail password! Use an App Password
  },
});

const Outlooktransporter = nodemailer.createTransport({
  host: "smtp.office365.com",  // for Outlook 365
  port: 587,
  secure: false,               // use TLS
  auth: {
    user: "husain68644@outlook.com",  // your Outlook/Office365 email
    pass: "lqgbnjloiiwfnxyv",           // your Outlook/Office365 password or App Password
  },
  tls: {
    ciphers: "SSLv3",
  },
});

export default async function SendMail({ to, subject, message,html,attachments }){
      const mailOptions = {
      from: process.env.EMAIL,
      to,
      subject,
      text: message,
      html:html,
      attachments
    };
  try {
     const res= await Gmailtransporter.sendMail(mailOptions);
     return res
  } catch (error) {
    if(error){return error}
  }
}