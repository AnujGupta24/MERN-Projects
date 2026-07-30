import { User } from '../models/user.model.js';
import { Address } from '../models/address.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const addAddress = asyncHandler(async (req, res) => {
	const userId = req.user._id;
	const { addressLine, city, state, pincode, country, mobile } = req.body;

	if (!addressLine || !city || !state || !pincode || !country || !mobile) {
		throw new ApiError(400, 'All fields are required');
	}

	const address = await Address.create({
		user: userId,
		addressLine,
		city,
		state,
		pincode,
		country,
		mobile,
	});

	return res.status(201).json(new ApiResponse(201, address, 'Address added successfully'));
});

export const getUserAllAddress = asyncHandler(async (req, res) => {
	const userId = req.user._id;

	const addresses = await Address.find({
		user: userId,
	}).sort({ createdAt: -1 });
	return res.status(200).json(new ApiResponse(200, addresses, 'Address deleted successfully'));
});

export const deleteAddress = asyncHandler(async (req, res) => {
	const userId = req.user._id;
	const { addressId } = req.params;

	if (!addressId) {
		throw new ApiError(400, 'Address id is required');
	}

	const address = await Address.findOne({
		_id: addressId,
		user: userId,
	});

	if (!address) {
		throw new ApiError(404, 'Address not found');
	}
	await Address.findByIdAndDelete(addressId);

	const updatedAddresses = await Address.find({
		user: userId,
	}).sort({ created: -1 });

	return res.status(200).json(new ApiResponse(200, updatedAddresses, 'Address deleted successfully'));
});

export const editAddress = asyncHandler(async (req, res) => {
	const { addressId } = req.params;
	const userId = req.user._id;
	const { addressLine, city, state, pincode, country, mobile } = req.body;

	const updatedAddress = await Address.findOneAndUpdate(
		{
			_id: addressId,
			user: userId,
		},
		{
			addressLine,
			city,
			state,
			pincode,
			country,
			mobile,
		},
		{ returnDocument: 'after', runValidators: true },
	);

	if (!updatedAddress) {
		throw new ApiError(404, 'Address not found');
	}

	const addresses = await Address.find({
		user: userId,
	});

	return res.status(200).json(new ApiResponse(200, addresses, 'Address updated successfully'));
});
