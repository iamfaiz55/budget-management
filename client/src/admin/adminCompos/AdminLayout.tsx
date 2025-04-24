import  { useState } from "react";
// import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div 
        className={`p-6 transition-all duration-300 ${
          isSidebarOpen ? "ml-60 w-[calc(100%-15rem)]" : "ml-20 w-[calc(100%-5rem)]"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
