import { NavLink } from "react-router-dom";
import {
  FaCalendarAlt, FaChartPie, FaUser,
  FaLayerGroup, FaClipboardList, FaBars, FaTimes,
  FaSignOutAlt
} from "react-icons/fa";
import "./navbar.css"
const Navbar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) => {
  return (
    <nav
      className={`fixed top-0 left-0 h-screen bg-white shadow-lg border-r border-gray-200 p-5 flex flex-col transition-all duration-300 ${
        isOpen ? "w-60" : "w-24"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`absolute bg-indigo-600 text-white p-2 rounded-full shadow-lg focus:outline-none transition-all duration-300 ${
          isOpen ? "top-4 right-4" : "top-5 left-8"
        }`}
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      <div className="mt-12 flex-1 overflow-y-auto no-scrollbar">

       <style>
  {`
    nav div::-webkit-scrollbar {
      display: none;
    }
  `}
</style>


        {isOpen && (
          <h1 className="text-xl font-bold text-gray-800 mb-5 text-center">
            Budget Manager
          </h1>
        )}

        {[
          { id: "navDay",name: "Day", path: "/user", icon: <FaClipboardList /> },
          { id: "navCalendar",name: "Calendar", path: "/user/calendar", icon: <FaCalendarAlt /> },
          { id: "navMonth",name: "Month", path: "/user/month", icon: <FaLayerGroup /> },
          { id: "navTotal",name: "Total", path: "/user/total", icon: <FaChartPie /> },
          { id: "navStatistics",name: "Statistics", path: "/user/stats", icon: <FaChartPie /> },
          { id: "navAccount",name: "Account", path: "/user/account", icon: <FaUser /> },
          {id: "navFamily", name: "Family", path: "/user/family", icon: <FaUser /> },
          { id: "navMore",name: "More", path: "/user/more", icon: <FaUser /> },
        ].map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            end={link.path === "/user"}
            id={link.id} // 👈 add id here
            className={({ isActive }) =>
              `flex items-center space-x-3 py-4 px-4 rounded-lg transition duration-300 text-gray-700 hover:bg-indigo-500 hover:text-white ${
                isActive ? "bg-indigo-600 text-white shadow-md" : ""
              }`
            }
          >
            <div className="text-xl">{link.icon}</div>
            {isOpen && (
              <span className="text-md font-medium transition-all duration-300">
                {link.name}
              </span>
            )}
          </NavLink>
        ))}
      </div>

      <button
        // onClick={handleLogout}
        className="mt-4 flex items-center justify-center gap-3 p-3 rounded-lg text-red-600 hover:text-white hover:bg-red-500 transition duration-300"
      >
        <FaSignOutAlt size={20} />
        {isOpen && <span className="text-md font-medium">Logout</span>}
      </button>
    </nav>
  );
};

export default Navbar;
