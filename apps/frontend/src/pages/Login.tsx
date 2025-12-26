import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Github,
  Sparkles,
  Shield,
  Zap,
} from 'lucide-react';
import { login, getAuthToken } from '@/api/auth';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      navigate('/', { replace: true });
      return;
    }

    const oauthToken = searchParams.get('token');
    if (oauthToken) {
      localStorage.setItem('token', oauthToken);
      const redirectTo = searchParams.get('redirect');
      navigate(redirectTo ? decodeURIComponent(redirectTo) : '/', {
        replace: true,
      });
    }
  }, [searchParams, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await login(email, password);
      localStorage.setItem('token', res.token);
      const redirectTo = searchParams.get('redirect');
      navigate(redirectTo ? decodeURIComponent(redirectTo) : '/', {
        replace: true,
      });
    } catch (err) {
      console.error('Login failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'github') => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}`;
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4">

      {/* 🔙 Back to Home */}
      <Link
        to="/"
        className="
          absolute left-4 top-4
          lg:fixed lg:left-6 lg:top-6
          z-50 flex items-center gap-2
          text-sm font-medium text-muted-foreground
          hover:text-foreground transition
        "
      >
        <ArrowLeft size={16} />
        Back to home
      </Link>

      {/* 🌌 Ambient Neon Background — Desktop Only */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none">
        <div className="absolute top-[15%] left-[12%] neon-float">
          <div className="neon-chip">
            <Sparkles size={18} />
            <span>Continue Your Work</span>
          </div>
        </div>

        <div className="absolute bottom-[22%] left-[8%] neon-float delay-1">
          <div className="neon-chip lavender">
            <Shield size={18} />
            <span>Secure Sign-In</span>
          </div>
        </div>

        <div className="absolute top-[30%] right-[10%] neon-float delay-2">
          <div className="neon-chip peach">
            <Zap size={18} />
            <span>Instant Access</span>
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="neon-glow" />
        </div>
      </div>

      {/* 🧾 Login Card */}
      <div className="relative z-10 w-full max-w-[420px] mt-12 lg:mt-0">
        <Card
          className="
            bg-transparent border-0 shadow-none
            lg:bg-card lg:border lg:border-border/50 lg:shadow-elevated
            lg:rounded-2xl
          "
        >
          <CardContent className="p-0 lg:p-8">
            <div className="p-6">

              <div className="mb-8 text-center">
                <h2 className="text-2xl font-semibold mb-2">
                  Welcome back
                </h2>
                <p className="text-sm text-muted-foreground">
                  Sign in to continue working with your AI agents
                </p>
              </div>

              {/* Social login */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-12 rounded-xl border-border/50"
                  onClick={() => handleSocialLogin('google')}
                >
                  Google
                </Button>

                <Button
                  variant="outline"
                  className="h-12 rounded-xl border-border/50"
                  onClick={() => handleSocialLogin('github')}
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </div>

              <div className="my-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  Or continue with
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-neon"
                />

                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-neon pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm">
                 
                  <a href="#" className="text-primary font-medium hover:underline">
                    Forgot password?
                  </a>
                </div>

                <Button
                  disabled={isLoading}
                  variant="pill" size="sm"
                  className="w-full h-12 rounded-xl font-medium"
                >
                  {isLoading ? 'Signing in…' : 'Sign In'}
                </Button>
              </form>

              <p className="mt-8 text-center text-sm text-muted-foreground">
                Don’t have an account?{' '}
                <Link
                  to="/signup"
                  className="text-primary font-semibold hover:underline"
                >
                  Sign up
                </Link>
              </p>

            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
