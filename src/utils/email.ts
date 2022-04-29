import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "./config.env" });
}

import nodemailer from "nodemailer";
import ejs from "ejs";
import htmlToText from "html-to-text";
import path from "path";

import { IUserDoc } from "../models/userModel";
import CatchAsync from "./CatchAsync";

const emailfrom: string = process.env.EMAIL_FROM as string;
//const nodeenv: any = process.env.NODE_ENV;
const sendgriduser: string = process.env.SENDGRID_USERNAME as string;
const sendgridpass: any = process.env.SENDGRID_PASS;

export class Email {
  to: string;
  firstName: string;
  url: string;
  from: string;

  constructor(user: IUserDoc, url: string) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `ChatEasy<${emailfrom}>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      service: "SendGrid",
      auth: {
        user: sendgriduser,
        pass: sendgridpass,
      },
    });
  }

  async send(template: any, subject: string) {
    const html: any = await ejs.renderFile(
      path.join(__dirname, `/../views/emails/${template}.ejs`),
      {
        firstName: this.firstName,
        to: this.to,
        url: this.url,
        subject,
      }
    );

    const mailoptions: any = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    await this.newTransport().sendMail(mailoptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to ChatEasy!");
  }
  async sendPasswordReset() {
    await this.send("passwordReset", "YOUR PASSWORD RESET TOKEN");
  }
}
