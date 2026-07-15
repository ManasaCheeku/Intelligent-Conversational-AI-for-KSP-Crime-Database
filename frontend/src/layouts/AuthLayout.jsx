import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-100">
      <Outlet />
    </div>
  );
}

export default AuthLayout;
