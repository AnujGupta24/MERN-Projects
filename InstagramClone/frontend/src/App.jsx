import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import MainLayout from './components/MainLayout';
import Home from './components/Home';
import Profile from './components/Profile';
import Editprofile from './components/Editprofile';
import ChatPage from './components/ChatPage';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setSocket } from './redux/socketSlice';
import { setOnlineUsers } from './redux/chatSlice';
import { setLikeNotification } from './redux/realTimeNotiSlice';
import ProtectedRoutes from './components/ProtectedRoutes';

function App() {
	const router = createBrowserRouter([
		{
			path: '/',
			element: (
				<ProtectedRoutes>
					<MainLayout />
				</ProtectedRoutes>
			),
			children: [
				{
					path: '/',
					element: (
						<ProtectedRoutes>
							<Home />
						</ProtectedRoutes>
					),
				},
				{
					path: '/profile/:id',
					element: (
						<ProtectedRoutes>
							<Profile />
						</ProtectedRoutes>
					),
				},
				{
					path: '/account/edit',
					element: (
						<ProtectedRoutes>
							<Editprofile />
						</ProtectedRoutes>
					),
				},
				{
					path: '/chat',
					element: (
						<ProtectedRoutes>
							<ChatPage />
						</ProtectedRoutes>
					),
				},
			],
		},
		{
			path: '/login',
			element: <Login />,
		},
		{
			path: '/signup',
			element: <SignUp />,
		},
	]);

	const { user } = useSelector((state) => state.auth);
	const { socket } = useSelector((state) => state.socketio);

	const dispatch = useDispatch();

	// socket io integration
	useEffect(() => {
		if (!user) {
			socket?.close();
			dispatch(setSocket(null));
			return;
		}

		const socketio = io('http://localhost:4000', {
			query: {
				userId: user._id,
			},
			transports: ['websocket'],
		});

		dispatch(setSocket(socketio));

		// listen all the events
		socketio.on('getOnlineUsers', (onlineUsers) => {
			dispatch(setOnlineUsers(onlineUsers));
		});

		socketio.on('notification', (notification) => {
			dispatch(setLikeNotification(notification));
		});

		return () => {
			socketio.close();
			dispatch(setSocket(null));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, user]);

	return (
		<>
			<RouterProvider router={router} />
		</>
	);
}

export default App;
