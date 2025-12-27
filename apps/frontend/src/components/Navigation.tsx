import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, LogOut, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
    setIsMenuOpen(false); // close menu on route change
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
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-4">
        <div className="relative z-[60] flex items-center justify-between rounded-full bg-card/80 backdrop-blur-xl border border-border/50 px-4 py-2 shadow-soft">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <span className="text-lg font-semibold text-foreground tracking-tight">
              Roleforge
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-full transition-all hover:bg-secondary",
                  location.pathname === link.path
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">

            {/* Desktop auth */}
            <div className="hidden md:flex items-center gap-2">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-full transition-all hover:bg-destructive/20"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              ) : (
                <Button asChild variant="ghost" size="sm" className="rounded-full">
                  <Link to="/login">Sign In</Link>
                </Button>
              )}
            </div>

            {/* Desktop CTA */}
            {location.pathname !== '/create' && (
              <Button
                asChild
                variant="pill"
                size="sm"
                className="hidden sm:flex shadow-float"
              >
                <Link to="/create">
                  <Plus size={16} />
                  Forge Agent
                </Link>
              </Button>
            )}

            {/* Mobile toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex h-10 w-10 flex-col items-center justify-center gap-[6px] rounded-full bg-secondary/50 transition-all active:scale-90"
              aria-label="Toggle menu"
            >
              <span
                className={cn(
                  "h-[2px] w-5 rounded-full bg-foreground transition-all duration-300",
                  isMenuOpen && "translate-y-[4px] rotate-45 w-6"
                )}
              />
              <span
                className={cn(
                  "h-[2px] w-3 self-end mr-[10px] rounded-full bg-foreground transition-all duration-300",
                  isMenuOpen && "-translate-y-[4px] -rotate-45 w-6 self-center mr-0"
                )}
              />
            </button>
          </div>
        </div>

        {/* ================= COMPACT MOBILE DROPDOWN ================= */}
        <div
          className={cn(
            "absolute right-4 top-[80px] z-50 md:hidden w-auto min-w-[180px] origin-top-right transition-all duration-300",
            isMenuOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          )}
        >
          <div className="flex flex-col gap-2 rounded-2xl bg-card/95 backdrop-blur-xl border border-border/50 p-4 shadow-elevated">
            
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-xl transition-all",
                  location.pathname === link.path 
                    ? "bg-secondary text-foreground" 
                    : "text-muted-foreground hover:bg-secondary/50"
                )}
              >
                {link.name}
              </Link>
            ))}

            <div className="h-px w-full bg-border/50 my-1" />

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-xl transition-all hover:bg-destructive/20"
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary/50 rounded-xl transition-all"
              >
                <User size={16} />
                Sign In
              </Link>
            )}

            {location.pathname !== '/create' && (
              <Button
                asChild
                variant="pill"
                size="sm"
                className="mt-2 w-fit mx-auto px-5 py-2 text-xs"
              >
                <Link to="/create">
                  <Plus size={14} />
                  Forge Agent
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}