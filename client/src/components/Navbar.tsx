import { NavLink } from "react-router-dom";
import { 
  FaCalendarAlt, FaChartPie, FaUser, 
  FaLayerGroup, FaClipboardList, FaBars, FaTimes 
} from "react-icons/fa";

const Navbar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) => {
  return (
    <>
      {/* Sidebar */}
      <nav 
        className={`fixed top-0 left-0 h-screen bg-white shadow-lg border-r border-gray-200 p-5 flex flex-col space-y-4 transition-all duration-300 ${
          isOpen ? "w-60" : "w-24"
        }`}
      >
        {/* Toggle Button (Inside when open, outside when closed) */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className={`absolute bg-indigo-600 text-white p-2 rounded-full shadow-lg focus:outline-none transition-all duration-300 ${
            isOpen ? "top-4 right-4" : "top-5 left-8"
          }`}
        >
          {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

       

       <div className="mt-12">
         {/* Sidebar Title */}
         {isOpen && (
          <h1 className="text-xl   font-bold text-gray-800 mb-5 text-center transition-all duration-300">
            Budget Manager
          </h1>
        )}
         {/* Menu Items */}
         {[
          { name: "Calendar", path: "/user/calendar", icon: <FaCalendarAlt /> },
          { name: "Day", path: "/user/day", icon: <FaClipboardList /> },
          { name: "Month", path: "/user/month", icon: <FaLayerGroup /> },
          { name: "Total", path: "/user/total", icon: <FaChartPie /> },
          { name: "Account", path: "/user/account", icon: <FaUser /> },
        ].map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 py-4 px-4 rounded-lg transition duration-300 text-gray-700 hover:bg-indigo-500 hover:text-white ${
                isActive ? "bg-indigo-600 text-white shadow-md" : ""
              }`
            }
          >
            <div className="text-xl">{link.icon}</div>
            {isOpen && <span className="text-md font-medium transition-all duration-300">{link.name}</span>}
          </NavLink>
        ))}
       </div>
      </nav>
    </>
  );
};

export default Navbar;
