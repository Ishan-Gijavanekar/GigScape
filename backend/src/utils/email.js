import nodemailer from 'nodemailer';

const sendEmail = async ({to, subject, html, text}) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: process.env.GigScape || `"GigScape" <no-reply@gigscape.com>`,
            to,
            text,
            html
        });
        console.log(`Email sent: ${info.messageId}`);
        return info;
    } catch (error) {
        console.log("Error in sending email: ", error);
        throw new Error("Email could not be sent");
    }
}

export {sendEmail}