import { createTransport } from "nodemailer";

export const sendEmail = async (to, subject, text, from) => {
  const transporter = createTransport({
    // host: process.env.SMTP_HOST,
    // port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    to: to,
    subject: subject,
    text: text,
  });
};
