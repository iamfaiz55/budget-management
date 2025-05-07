import { NavLink } from "react-router-dom";
import {
  FaClipboardList, FaCalendarAlt, FaLayerGroup,
  FaChartPie, FaUser
} from "react-icons/fa";

const MobileNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white shadow-md border-t border-gray-200 flex justify-around py-2 md:hidden z-50">
      {[
        { path: "/user", icon: <FaClipboardList />, label: "Day" },
        { path: "/user/calendar", icon: <FaCalendarAlt />, label: "Calendar" },
        { path: "/user/month", icon: <FaLayerGroup />, label: "Month" },
        { path: "/user/stats", icon: <FaChartPie />, label: "Stats" },
        { path: "/user/account", icon: <FaUser />, label: "Account" },
      ].map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          className={({ isActive }) =>
            `flex flex-col items-center text-sm ${
              isActive ? "text-indigo-600" : "text-gray-600"
            }`
          }
        >
          <div className="text-lg">{link.icon}</div>
          <span className="text-xs mt-1">{link.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileNav;
