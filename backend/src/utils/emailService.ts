import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export interface EmailOptions {
  subject: string;
  text: string;
  to: string;
}

const createTransporter = () => {
  const { SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_USER } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
    throw new Error('SMTP_HOST, SMTP_USER and SMTP_PASSWORD must be set to send emails');
  }

  const port = Number(SMTP_PORT ?? 587);

  return nodemailer.createTransport({
    auth: {
      pass: SMTP_PASSWORD,
      user: SMTP_USER,
    },
    host: SMTP_HOST,
    port,
    secure: port === 465 // implicit TLS, otherwise STARTTLS
  });
};

export const sendEmail = async (options: EmailOptions): Promise<SMTPTransport.SentMessageInfo> => {
  const transporter = createTransporter();

  return transporter.sendMail({
    ...options,
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
  });
};
