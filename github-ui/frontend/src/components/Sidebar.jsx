function Sidebar({ activeItem, onNavigate }) {
  const menuItems = [
    "Dashboard",
    "Repositories",
    "Actions",
    "Pull Requests",
    "Issues",
    "Terraform",
    "Resources",
    "Clusters",
    "Settings",
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
          <button
            key={item}
            className={`nav-item ${
              activeItem === item ? "active" : ""
            }`}
            onClick={() => onNavigate(item)}
          >
            {item}
          </button>
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