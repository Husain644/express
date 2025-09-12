import nodemailer from "nodemailer";
// 1. Configure transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // or use "smtp.ethereal.email" for testing
  auth: {
    user: "husain68644@gmail.com",
    pass: "vujxqvfkyktkmfjx", // NOT your Gmail password! Use an App Password
  },
});

export default async function SendMail({ to, subject, message }){
      const mailOptions = {
      from: "husain68644@gmail.com",
      to,
      subject,
      text: message,
      html: `<h2 style="color:'red'">Hello world?</h2>`,
        list: {
    unsubscribe: [
      {
        url: `https://techtt.site/account/emailsubscribe?email=${to}`,
        comment: "Unsubscribe from our mailing list",
      },
    ],
  },
    };
  try {
     const res= await transporter.sendMail(mailOptions);
     return res
  } catch (error) {
    if(error){return error}
  }
}