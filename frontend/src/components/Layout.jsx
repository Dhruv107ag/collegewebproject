import { useContext, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { LogOut, User, LayoutDashboard, Menu, X, Users } from 'lucide-react';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = {
    student: [{ name: 'My Dashboard', path: '/student', icon: LayoutDashboard }],
    admin: [
      { name: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
    ],
  };

  const getNavItems = () => {
    if (!user) return [];
    return navItems[user.role] || [];
  };

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h1 className="brand-title">College Portal</h1>
        </div>
        
        <nav className="sidebar-nav">
          {getNavItems().map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon className="nav-icon" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar">
              {user?.name?.charAt(0)}
            </div>
            <div className="user-details">
              <h4>{user?.name}</h4>
              <p>{user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
