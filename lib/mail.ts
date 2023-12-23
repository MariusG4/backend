import { createTransport } from "nodemailer";
require("dotenv").config();

const host = process.env.MAIL_HOST;
const port = process.env.MAIL_PORT;
const jobEmail = process.env.JOB_EMAIL_ADDRESS;
const formsEmail = process.env.FORMS_EMAIL_ADDRESS;
const contactEmail = process.env.CONTACT_EMAIL_ADDRESS;
const employerForms = process.env.EMPLOYER_EMAIL_ADDRESS;

const transport = createTransport({
  //@ts-ignore
  host,
  port,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

transport.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

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
  })) as unknown as MailResponse;
}

export async function sendContactUsEmail(
  name: string,
  email: string,
  phone: string,
  message: string
): Promise<void> {
  // email the user a token
  const info = await transport.sendMail({
    to: contactEmail,
    from: "backend@humansource.ro",
    subject: "New Contact Us Message!",
    html: makeNiceEmail(`New Contact Us Message!
        <p>Name: ${name}</p>
        <p>Email: ${email}</p>
        <p>Phone: ${phone}</p>
        <p>Message: ${message}</p>
        `),
  });
}

export async function sendJobApplicationEmail(
  name: string,
  email: string,
  phone: string,
  message: string,
  birthDate: string,
  job: string
): Promise<void> {
  const info = await transport.sendMail({
    to: jobEmail,
    from: "backend@humansource.ro",
    subject: "New Job Application!",
    html: makeNiceEmail(`New Job Application!
        <p>Name: ${name}</p>
        <p>Email: ${email}</p>
        <p>Phone: ${phone}</p>
        <p>Birth Date: ${birthDate}</p>
        <p>Job: ${job}</p>
        <p>Message: ${message}</p>
        `),
  });
  console.log(info);
}

export async function sendMedicalFormEmail(
  domeniu: string,
  subDomeniu: string,
  experienta: string,
  bac: string,
  amg: string,
  absolvire: string,
  experientaLimba: string,
  locatia: string,
  ultimuSalar: number,
  cursItaliana: string
): Promise<void> {
  const info = await transport.sendMail({
    to: formsEmail,
    from: "backend@humansource.ro",
    subject: "New Medical Form!",
    html: makeNiceEmail(`New Medical Form!
        <p>Domeniu: ${domeniu}</p>
        <p>SubDomeniu: ${subDomeniu}</p>
        <p>Experienta: ${experienta}</p>
        <p>Bac: ${bac}</p>
        <p>AMG: ${amg}</p>
        <p>Absolvire: ${absolvire}</p>
        <p>Experienta Limba: ${experientaLimba}</p>
        <p>Locatie: ${locatia}</p>
        <p>Ultima Salar: ${ultimuSalar}</p>
        <p>Curs Italiana: ${cursItaliana}</p>
        `),
  });
}

export async function sendTransportFormEmail(
  domeniu: string,
  subDomeniu: string,
  experienta: string,
  locatia: string,
  tahograf: string,
  echipa: string,
  turaNoapte: string,
  experientaLimba: string,
  ultimuSalar: number,
  salariuDorit: number
): Promise<void> {
  const info = await transport.sendMail({
    to: formsEmail,
    from: "backend@humansource.ro",
    subject: "New Transport Form!",
    html: makeNiceEmail(`New Transport Form!
        <p>Domeniu: ${domeniu}</p>
        <p>SubDomeniu: ${subDomeniu}</p>
        <p>Experienta: ${experienta}</p>
        <p>Locatie: ${locatia}</p>
        <p>Tahograf: ${tahograf}</p>
        <p>Echipa: ${echipa}</p>
        <p>Tura Noapte: ${turaNoapte}</p>
        <p>Experienta Limba: ${experientaLimba}</p>
        <p>Ultima Salar: ${ultimuSalar}</p>
        <p>Salariu Dorit: ${salariuDorit}</p>
        `),
  });
}

export async function sendEmployerFormEmail(
  domeniu: string,
  subDomeniu: string,
  codFiscal: string,
  nrPersoane: string,
  dateContact: string,
  email: string,
  nrTel: number
): Promise<void> {
  const info = await transport.sendMail({
    to: employerForms,
    from: "backend@humansource.ro",
    subject: "New Employer Form!",
    html: makeNiceEmail(`New Employer Form!
        <p>Domeniu: ${domeniu}</p>
        <p>SubDomeniu: ${subDomeniu}</p>
        <p>Cod Fiscal: ${codFiscal}</p>
        <p>Nr Persoane: ${nrPersoane}</p>
        <p>Date Contact: ${dateContact}</p>
        <p>Email: ${email}</p>
        <p>Nr Tel: ${nrTel}</p>
        `),
  });
}
