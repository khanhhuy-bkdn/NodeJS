import nodemailer from 'nodemailer';
import { mailConfig } from '../config/index'

export default class MailService {
    static async sendMail(fromInfo, toMail, subject, text, html) {
        const transporter = nodemailer.createTransport(
            mailConfig
        );
        // setup email data with unicode symbols
        const mailOptions = {
            from: fromInfo || '"Fred Foo 👻" <foo@example.com>', // sender address
            to: toMail || "bar@example.com, baz@example.com", // list of receivers
            subject: subject || "Hello ✔", // Subject line
            text: text || "Hello world?", // plain text body
            html: html || "<b>Hello world?</b>" // html body
        };

        // send mail with defined transport object
        return transporter.sendMail(mailOptions)
    }
}