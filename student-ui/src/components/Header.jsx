import { useLocation } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const titles = {
  '/dashboard': { title: 'Dashboard', sub: 'Welcome back! Here\'s what\'s happening.' },
  '/students': { title: 'Students', sub: 'Manage all enrolled students.' },
  '/students/new': { title: 'Add Student', sub: 'Enroll a new student.' },
};

export default function Header() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const info = titles[pathname] || titles['/dashboard'];

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">{info.title}</h1>
        <p className="header-sub">{info.sub}</p>
      </div>
      <div className="header-right">
        <div className="header-search">
          <Search size={15} className="search-icon" />
          <input placeholder="Search anything..." className="search-input" />
        </div>
        <button className="icon-btn notif-btn">
          <Bell size={18} />
          <span className="notif-dot" />
        </button>
        <div className="header-avatar">{user?.[0]?.toUpperCase()}</div>
      </div>
    </header>
  );
}
