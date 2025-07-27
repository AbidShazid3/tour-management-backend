/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from 'nodemailer';
import { envVars } from '../config/evn';
import path from 'path';
import ejs from 'ejs';
import AppError from '../errorHelpers/AppError';

const transport = nodemailer.createTransport({
    host: envVars.EMAIL_SENDER.SMTP_HOST,
    port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
    secure: true,
    auth: {
        user: envVars.EMAIL_SENDER.SMTP_USER,
        pass: envVars.EMAIL_SENDER.SMTP_PASS
    }
})


export interface ISendEmailOptions {
    to: string,
    subject: string,
    templateName: string,
    templateData?: Record<string, any>
    attachments?: {
        filename: string,
        content: Buffer | string,
        contentType: string
    }[]
}

export const sendEmail = async ({
    to,
    subject,
    templateName,
    templateData,
    attachments,
}: ISendEmailOptions) => {
    try {
        const templatePath = path.join(__dirname, `templates/${templateName}.ejs`)
        console.log(templatePath);
        const html = await ejs.renderFile(templatePath, templateData) || {};
        const info = await transport.sendMail({
            from: envVars.EMAIL_SENDER.SMTP_FROM,
            to: to,
            subject: subject,
            html: html,
            attachments: attachments?.map(attachment => ({
                filename: attachment.filename,
                content: attachment.content,
                contentType: attachment.contentType
            }))
        })
        console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`)
    } catch (error: any) {
        console.log('Mail sending error', error.message);
        throw new AppError(401, "Mail sending error")
    }
}