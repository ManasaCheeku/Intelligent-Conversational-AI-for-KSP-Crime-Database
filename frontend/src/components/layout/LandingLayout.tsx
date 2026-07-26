import { Outlet } from "react-router-dom";
import { LandingNavbar } from "../../LandingNavbar";
// You would create a LandingFooter component similar to the Navbar
// import { LandingFooter } from "../landing/LandingFooter";

export default function LandingLayout() {
  return (
    <div className="bg-slate-950 text-white font-sans">
      <LandingNavbar />
      <Outlet />
      {/* <LandingFooter /> */}
    </div>
  );
}