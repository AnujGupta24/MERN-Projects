import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, html, attachments = [] }) => {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.MAIL_HOST,
			port: Number(process.env.MAIL_PORT),
			secure: false, // true only for 465
			auth: {
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASS,
			},
		});

		const mailOptions = {
			from: `"Blinkit Clone" <${process.env.MAIL_USER}>`,
			to,
			subject,
			html,
			attachments,
		};

		const info = await transporter.sendMail(mailOptions);

		console.log('Email sent:', info.messageId);

		return info;
	} catch (error) {
		console.error('Email Error:', error.message);
		throw new Error('Failed to send email');
	}
};

export default sendEmail;
