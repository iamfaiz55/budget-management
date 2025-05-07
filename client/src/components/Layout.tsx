import { useState } from "react";
import Navbar from "./Navbar";
// import MobileNav from "./MobileNav";
import { Outlet } from "react-router-dom";
import MobileNav from "./MobileNav";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar for medium and up */}
      <div className="hidden md:block">
        <Navbar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </div>

      {/* Main Content */}
      <main
        className={`flex-1 p-4 md:p-6 transition-all duration-300 mt-16 md:mt-0 ${
          isSidebarOpen ? "md:ml-60" : "md:ml-24"
        }`}
      >
        <Outlet />
      </main>

      {/* Bottom Nav for small screens only */}
      <div className="md:hidden">
        <MobileNav />
      </div>
    </div>
  );
};

export default Layout;
