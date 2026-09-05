const twilio = require('twilio');
const { Resend } = require('resend');

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendSms(to, body) {
  if (!to) return null;
  return twilioClient.messages.create({
    to,
    from: process.env.TWILIO_FROM_NUMBER,
    body
  });
}

async function sendEmail(to, subject, body) {
  if (!to) return null;
  return resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text: body
  });
}

module.exports = { sendSms, sendEmail };
