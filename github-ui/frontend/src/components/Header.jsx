import {
    Search,
    Bell,
    Github,
    ChevronDown,
  } from "lucide-react";
  
  export default function Header({ title = "Dashboard" }) {
    return (
      <header className="header">
  
        {/* Left */}
        <div className="header-left">
          <div className="header-title">
            {title}
          </div>
        </div>
  
        {/* Right */}
        <div className="header-right">
  
          {/* Search */}
          <div className="search">
            <Search
              size={16}
              className="search-icon"
            />
  
            <input
              type="text"
              placeholder="Search..."
            />
          </div>
  
          {/* Notifications */}
          <button className="header-icon-button">
            <Bell size={18} />
          </button>
  
          {/* GitHub */}
          <button className="header-icon-button">
            <Github size={18} />
          </button>
  
          {/* User */}
          <button className="header-icon-button">
            <ChevronDown size={17} />
          </button>
  
        </div>
  
      </header>
    );
  }