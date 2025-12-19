import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useEffect } from 'react';

export function Navigation() {
  const location = useLocation();

  useEffect(() => {
    // Always apply dark mode
    document.documentElement.classList.add('dark');
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Agents', path: '/agents' },
    
  ];

  return (
    <nav className="sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-6xl px-6 py-4 pb-0">
        <div className="flex items-center justify-between rounded-full bg-card/80 backdrop-blur-xl border border-border/50 px-4 py-2 shadow-soft">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <span className="text-sm font-bold text-primary-foreground">R</span>
            </div>
            <span className="text-lg font-semibold text-foreground">Roleforge</span>
          </Link>

          {/* Center Nav Links */}
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

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="h-9">
              <Link to="/login">
                Sign In
              </Link>
            </Button>
            
            {location.pathname !== '/create' && (
              <Button asChild variant="pill" size="sm" className="h-9">
                <Link to="/create">
                  <Plus size={16} />
                  <span className="hidden sm:inline">New Agent</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}