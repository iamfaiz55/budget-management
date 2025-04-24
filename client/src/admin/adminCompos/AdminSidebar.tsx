
import { NavLink } from "react-router-dom";
import {
  HiOutlineViewGrid,
  HiOutlineUsers,
  HiOutlineTag,
  HiOutlineUserGroup,
  HiOutlineChartBar,
  HiMenuAlt3,
  HiX,
  HiOutlineLogout
} from "react-icons/hi";
import { useSignOutMutation } from "../../redux/authApi";
// import { Tooltip } from "react-tooltip"; // Optional library for tooltips

const AdminSidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) => {
  const [logout]= useSignOutMutation()
  const navItems = [
    { name: "Dashboard", path: "/admin", icon: <HiOutlineViewGrid size={22} /> },
    { name: "Users", path: "/admin/users", icon: <HiOutlineUsers size={22} /> },
    { name: "Categories", path: "/admin/categories", icon: <HiOutlineTag size={22} /> },
    { name: "Premium Users", path: "/admin/premium-users", icon: <HiOutlineUserGroup size={22} /> },
    { name: "Plans", path: "/admin/plans", icon: <HiOutlineChartBar size={22} /> },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 h-screen bg-white shadow-lg border-r border-gray-200 p-5 flex flex-col space-y-4 transition-all duration-300 ${
        isOpen ? "w-60" : "w-24"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`absolute bg-indigo-600 text-white p-2 rounded-full shadow-lg focus:outline-none transition-all duration-300 ${
          isOpen ? "top-4 right-4" : "top-5 left-7"
        }`}
      >
        {isOpen ? <HiX size={20} /> : <HiMenuAlt3 size={20} />}
      </button>

      <div className="mt-12">
        {isOpen && (
          <h1 className="text-xl font-bold text-gray-800 mb-5 text-center">
            Admin Dashboard
          </h1>
        )}
        {navItems.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            end={link.path === "/admin"}
            className={({ isActive }) =>
              `flex items-center gap-4 py-3 px-4 rounded-lg transition duration-300 text-gray-700 hover:bg-indigo-500 hover:text-white ${
                isActive ? "bg-indigo-600 text-white shadow-md" : ""
              }`
            }
          >
            <div className="relative group">
              {link.icon}
              {!isOpen && (
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 whitespace-nowrap text-xs bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                  {link.name}
                </div>
              )}
            </div>
            {isOpen && <span className="text-sm font-medium">{link.name}</span>}
          </NavLink>
        ))}
        {/* Logout Button */}
{/* Logout Button (Fixed Bottom) */}
<button
  onClick={() => {
logout()
  }}
  className="absolute bottom-5 left-5 right-5 flex items-center gap-4 py-3 px-4 rounded-lg text-red-600 hover:bg-red-100 transition"
>
  <HiOutlineLogout size={22} className="text-red-500" />
  {isOpen && <span className="text-sm font-medium">Logout</span>}
</button>


      </div>
    </nav>
  );
};

export default AdminSidebar;
