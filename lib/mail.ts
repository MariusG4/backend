import { createTransport } from "nodemailer";
require("dotenv").config();
const transport = createTransport({
  //@ts-ignore
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transport.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

const MAIL_HOST = process.env.MAIL_HOST;
const MAIL_PORT = process.env.MAIL_PORT;
const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS;
console.log(MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS);
function makeNiceEmail(text: string) {
  return `
    <div style="
        border: 1px solid black;
        padding: 20px;
        font-family: sans-serif;
        line-height: 2;
        font-size: 20px;
    ">
    <h2>Hello There!</h2>
    <p>${text}</p>
    <p>😘, Humansource</p>
    </div>
    `;
}
export interface MailResponse {
  accepted?: string[] | null;
  rejected?: null[] | null;
  ehlo?: string[] | null;
  envelopeTime: number;
  messageTime: number;
  messageSize: number;
  response: string;
  envelope: Envelope;
  messageId: string;
}
export interface Envelope {
  from: string;
  to?: string[] | null;
}

export async function sendPasswordResetEmail(
  resetToken: string,
  to: string
): Promise<void> {
  // email the user a token
  const info = (await transport.sendMail({
    to,
    from: "backend@humansource.ro",
    subject: "Your password reset token!",
    html: makeNiceEmail(`Your Password Reset Token is here!
        <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Click Here to Reset</a>
        `),
  })) as MailResponse;
  console.log(MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS);
  console.log(info);
}
