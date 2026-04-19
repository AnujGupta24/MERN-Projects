import { Outlet } from 'react-router-dom';
import LeftSidebar from './LeftSidebar';
import { useAuthCheck } from '@/hooks/useAuthCheck';

function MainLayout() {
	useAuthCheck();

	return (
		<div>
			<LeftSidebar />
			<div>
				<Outlet />
			</div>
		</div>
	);
}
export default MainLayout;
