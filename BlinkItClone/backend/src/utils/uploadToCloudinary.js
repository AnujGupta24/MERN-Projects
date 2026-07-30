import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const uploadToCloudinary = async (localFilePath) => {
	try {
		if (!localFilePath) return null;

		const response = await cloudinary.uploader.upload(localFilePath, {
			resource_type: 'auto',
			folder: 'BlinkItClone',
		});

		console.log('uploadToCloudinary util response: ', response);
		console.log('file is uploaded on cloudinary: ', response.url);

		fs.unlinkSync(localFilePath);
		return response;
	} catch (error) {
		console.log('uploadToCloudinary ERROR: ', error);
		fs.unlinkSync(localFilePath);
		return null;
	}
};
