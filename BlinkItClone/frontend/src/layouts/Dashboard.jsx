import UserMenu from "../components/UserMenu";
import { Outlet } from "react-router-dom";

function Dashboard() {
  return (
    <div className="container mx-auto grid min-h-[calc(100vh-120px)] grid-cols-[280px_1fr] gap-5 p-4">
      <div className="h-fit rounded-2xl bg-white p-3 shadow">
        <h2 className="mb-4 text-lg font-semibold">Dashboard</h2>
        <UserMenu />
      </div>

      <div className="rounded-2xl bg-white p-4 shadow">
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
