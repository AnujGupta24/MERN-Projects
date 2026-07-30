import PDFDocument from 'pdfkit';
import fs from 'fs';

export const generateInvoice = (order, user, paymentId) => {
	return new Promise((resolve, reject) => {
		// const filePath = `./invoices/${order.orderId}.pdf`;
		const filePath = `./public/invoices/${order.orderId}.pdf`;
		const doc = new PDFDocument();
		const stream = fs.createWriteStream(filePath);

		doc.pipe(stream);
		doc.fontSize(20).text('INVOICE from blinkit team');
		doc.moveDown();
		doc.text(`Order ID: ${order.orderId}`);
		doc.text(`Payment ID: ${paymentId}`);
		doc.text(`Customer: ${user.name}`);
		doc.text(`Email: ${user.email}`);
		doc.moveDown();
		doc.text(`Total Amount: ₹ ${order.totalAmount}`);
		doc.end();

		stream.on('finish', () => {
			resolve(filePath);
		});

		stream.on('error', reject);
	});
};
