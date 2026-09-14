import nodemailer from "nodemailer";

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export function isMailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function sendSubscriptionConfirmation(email: string, siteName = "The News") {
  const transport = getTransport();
  if (!transport) return;

  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;

  void transport
    .sendMail({
      from,
      to: email,
      subject: `Welcome to ${siteName}`,
      text: `Thank you for subscribing to ${siteName}. You'll receive our latest headlines in your inbox.`,
    })
    .catch((err) => {
      console.error("Failed to send subscription email:", err);
    });
}
