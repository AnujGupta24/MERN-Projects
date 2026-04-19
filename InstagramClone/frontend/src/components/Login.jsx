import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';

const Login = () => {
	const [input, setInput] = useState({
		email: '',
		password: '',
	});

	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const { user } = useSelector((state) => state.auth);
	const dispatch = useDispatch();

	const changeEventHandler = (e) => {
		const { name, value } = e.target;

		setInput((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const loginHandler = async (e) => {
		e.preventDefault();

		try {
			setLoading(true);
			const res = await axiosInstance.post('/user/login', input);
			// console.log('login response', res);

			if (res.data.success) {
				const user = res.data.data;
				dispatch(setAuthUser(user));
				toast.success(res.data.message);

				navigate('/');

				setInput({
					email: '',
					password: '',
				});
			}
		} catch (error) {
			toast.error(error?.response?.data?.message || 'email or password incorrect');
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
			<form onSubmit={loginHandler} className="shadow-xl flex flex-col gap-5 p-8 w-1/3 rounded-sm">
				<div className="my-2">
					<p className="text-xl font-medium text-center">Login</p>
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
					{loading ? 'Please wait...' : 'Login'}
				</Button>

				<span className="text-center">
					Don't have an account?{' '}
					<Link className="underline text-blue-600" to="/signup">
						SignUp
					</Link>
				</span>
			</form>
		</div>
	);
};
export default Login;
