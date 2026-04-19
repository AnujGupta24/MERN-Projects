import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { axiosInstance } from '@/lib/utils';
import { useSelector } from 'react-redux';

const SignUp = () => {
	const [input, setInput] = useState({
		username: '',
		email: '',
		password: '',
	});
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const { user } = useSelector((state) => state.auth);

	const changeEventHandler = (e) => {
		const { name, value } = e.target;

		setInput((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const signupHandler = async (e) => {
		e.preventDefault();

		try {
			setLoading(true);
			const res = await axiosInstance.post('/user/register', input);

			if (res.data.success) {
				toast.success(res.data.message);
				navigate('/login');
				setInput({
					username: '',
					email: '',
					password: '',
				});
			}
		} catch (error) {
			console.log(error);
			toast.error(error.response.data.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (user) {
			navigate('/');
		}
	}, [user, navigate]);

	return (
		<div className="h-screen w-screen flex items-center justify-center">
			<form onSubmit={signupHandler} className="shadow-xl flex flex-col gap-5 p-8 w-1/3 rounded-sm">
				<div className="my-2">
					<p className="text-xl font-medium text-center">SignUp</p>
				</div>

				<div>
					<Label className="font-medium">Username</Label>
					<Input
						type="text"
						name="username"
						value={input.username}
						onChange={changeEventHandler}
						placeholder="Enter your name"
						className="focus-visible:ring-transparent my-2"
					/>
				</div>
				<div>
					<Label className="font-medium">Email</Label>
					<Input
						type="text"
						name="email"
						value={input.email}
						onChange={changeEventHandler}
						placeholder="Enter your email"
						className="focus-visible:ring-transparent my-2"
					/>
				</div>
				<div>
					<Label className="font-medium">Password</Label>
					<Input
						type="password"
						name="password"
						value={input.password}
						onChange={changeEventHandler}
						placeholder="Enter your password"
						className="focus-visible:ring-transparent my-2"
					/>
				</div>

				<Button type="submit" disabled={loading} className="flex items-center">
					{loading && <Loader2 className="h-4 w-4 animate-spin" />}
					{loading ? 'Please wait...' : 'SignUp'}
				</Button>

				<span className="text-center">
					Already have an account?{' '}
					<Link className="underline text-blue-600" to="/login">
						login
					</Link>
				</span>
			</form>
		</div>
	);
};
export default SignUp;
