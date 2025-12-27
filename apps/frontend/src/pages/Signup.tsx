import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { signup, getAuthToken } from '@/api/auth';

export default function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await signup(name, email, password);
      localStorage.setItem('token', res.token);
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Signup failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'github') => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}`;
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4">

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

      <div className="hidden lg:block absolute inset-0 pointer-events-none">
        <div className="absolute top-[15%] left-[12%] neon-float">
          <div className="neon-chip">
            <Sparkles size={18} />
            <span>Create AI Personas</span>
          </div>
        </div>

        <div className="absolute bottom-[22%] left-[8%] neon-float delay-1">
          <div className="neon-chip lavender">
            <Shield size={18} />
            <span>Secure by Design</span>
          </div>
        </div>

        <div className="absolute top-[30%] right-[10%] neon-float delay-2">
          <div className="neon-chip peach">
            <Zap size={18} />
            <span>Lightning Fast AI</span>
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="neon-glow" />
        </div>
      </div>

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
                  Create your account
                </h2>
                <p className="text-sm text-muted-foreground">
                  Build and chat with intelligent AI agents
                </p>
              </div>

              {/* Social signup */}
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

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-neon"
                />

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

                <Button
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl font-medium"
                >
                  {isLoading ? 'Creating…' : 'Sign Up'}
                </Button>
              </form>

              <p className="mt-8 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary font-semibold hover:underline"
                >
                  Sign in
                </Link>
              </p>

            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
