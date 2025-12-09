import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const transporter = nodemailer.createTransport({
  auth: {
    pass: '1a2b3c4d5e6f7g',
    user: '1a2b3c4d5e6f7g',
  },
  host: 'live.smtp.mailtrap.io',
  port: 587,
  secure: false // use SSL
});

const mailOptions = {
  from: 'yourusername@email.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!',
  to: 'yourfriend@email.com'
};

transporter.sendMail(mailOptions, function(error: Error | null, info: SMTPTransport.SentMessageInfo){
  if (error) {
    console.log('Error:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});
