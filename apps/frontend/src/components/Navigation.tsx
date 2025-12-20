import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Agents', path: '/agents' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-6xl px-6 py-4 pb-0">
        <div className="flex items-center justify-between rounded-full bg-card/80 backdrop-blur-xl border border-border/50 px-4 py-2 shadow-soft">
          <Link to="/" className="flex items-center gap-2.5">
           {/*  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <span className="text-sm font-bold text-primary-foreground">R</span>
            </div> */}
            <span className="text-lg font-semibold text-foreground">Roleforge</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut size={14} />
                Logout
              </Button>
            ) : (
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Sign In</Link>
              </Button>
            )}
            
            {/* REMOVED isLoggedIn condition here */}
            {location.pathname !== '/create' && (
              <Button asChild variant="pill" size="sm">
                <Link to="/create">
                  <Plus size={16} />
                  <span>New Agent</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}