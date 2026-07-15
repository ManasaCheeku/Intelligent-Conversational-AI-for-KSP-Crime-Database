import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-blue-900 text-white p-5">
        <h2 className="text-xl font-bold">KSP IntelliCrime AI</h2>

        <ul className="mt-6 space-y-3">
          <li>Dashboard</li>
          <li>FIR</li>
          <li>Analytics</li>
          <li>Reports</li>
          <li>Users</li>
          <li>Settings</li>
        </ul>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;