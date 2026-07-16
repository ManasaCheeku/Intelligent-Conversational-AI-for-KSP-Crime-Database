import { Bell, Search, Shield, User } from "lucide-react";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <Shield className="text-blue-500" size={28} />
        <div>
          <h1 className="text-lg font-bold text-white">
            KSP IntelliCrime AI
          </h1>
          <p className="text-xs text-slate-400">
            Karnataka State Police
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center bg-slate-800 rounded-lg px-3 py-2 w-96">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search FIR, Criminal, Case..."
          className="bg-transparent outline-none text-white px-2 w-full placeholder:text-slate-500"
        />
      </div>

      <div className="flex items-center gap-5">
        <button className="relative">
          <Bell className="text-slate-300" size={22} />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500"></span>
        </button>

        <div className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded-lg">
          <User size={18} />
          <span className="text-sm">Officer</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;