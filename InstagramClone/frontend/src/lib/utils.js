import { logout } from '@/redux/authSlice';
import axios from 'axios';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import store from '@/redux/store';

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export function readFileAsDataURL(file) {
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.onloadend = () => {
			if (typeof reader.result === 'string') resolve(reader.result);
		};
		reader.readAsDataURL(file);
	});
}

export const axiosInstance = axios.create({
	baseURL: 'http://localhost:4000/api/v1',
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
});

axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			const dispatch = store.dispatch;
			dispatch(logout());
			window.location.href = '/login';
		}
		return Promise.reject(error);
	},
);
