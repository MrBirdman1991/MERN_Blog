import nodemailer, { Transporter } from "nodemailer";


class Mailer {
  private static transporter: Transporter;

  static getInstance(): Transporter {
    if (!Mailer.transporter) {
      return nodemailer.createTransport({
        service: process.env.Mailer_SERVICE,
        auth: {
          user: process.env.Mailer_USER,
          pass: process.env.Mailer_PASS,
        },
      });
    }

    return Mailer.transporter;
  }
}


export default Mailer;