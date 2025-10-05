import { Resend } from "resend";

// TODO: create notifications db table to keep track of all emails sent
export const resend = new Resend(process.env.RESEND_API_KEY);
