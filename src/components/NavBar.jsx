// src/components/NavBar.jsx
import { Link, useLocation } from 'react-router-dom';
import '../App.css';

export default function NavBar() {
  const { pathname } = useLocation();
  const onJournal = pathname === '/journal';

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1>{onJournal ? 'Expense Journal' : 'Analytics Dashboard'}</h1>
      </div>
      <div className="navbar-right">
        {onJournal ? (
          <Link to="/" className="nav-button">← Back to Dashboard</Link>
        ) : (
          <Link to="/journal" className="nav-button">Go to Journal</Link>
        )}
      </div>
    </nav>
  );
}
