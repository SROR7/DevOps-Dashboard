import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
    },
    {
      name: "Repositories",
      path: "/repositories",
    },
    {
      name: "Actions",
      path: "/actions",
    },
    {
      name: "Pull Requests",
      path: "/pull-requests",
    },
    {
      name: "Issues",
      path: "/issues",
    },
    {
      name: "AWS",
      path: "/aws",
    },
    {
      name: "Terraform",
      path: "/terraform",
    },
    {
      name: "Settings",
      path: "/settings",
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">D</div>

        <div>
          <h2>DevOps</h2>
          <span>Dashboard</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span>DevOps Dashboard</span>
        <small>v1.0.0</small>
      </div>
    </aside>
  );
}

export default Sidebar;