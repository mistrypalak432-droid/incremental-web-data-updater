import { NavLink } from "react-router-dom";

function Navbar() {
  const navItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: "⌂",
    },
    {
      path: "/scraper",
      label: "Scraper",
      icon: "◈",
    },
    {
      path: "/data",
      label: "Current Data",
      icon: "▦",
    },
    {
      path: "/history",
      label: "Change History",
      icon: "↻",
    },
    {
      path: "/analytics",
      label: "Analytics",
      icon: "◒",
    },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        <NavLink to="/" className="brand">
          <div className="brand-icon">
            ◈
          </div>

          <div className="brand-text">
            <span className="brand-main">
              DATAFLOW
            </span>

            <span className="brand-sub">
              WEB TRACKER
            </span>
          </div>
        </NavLink>

        <div className="nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <span className="nav-icon">
                {item.icon}
              </span>

              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="system-status">
          <span className="status-dot"></span>
          <span>System Online</span>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;