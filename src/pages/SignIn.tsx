import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [rememberMe, setRememberMe] = useState(false);

  // Show success message if redirected from signup
  useEffect(() => {
    const state = location.state as any;
    if (state?.message) {
      toast({
        title: "Success!",
        description: state.message,
      });
      // Clear the message from location state
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (!error) {
        // Redirect to the page they were trying to access, or home
        const from = (location.state as any)?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f7f7f7] dark:bg-[#18181b]">
      {/* Left Side - Form */}
      <div className="flex flex-1 items-center justify-center px-4 py-8 md:py-0">
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 md:p-10">
          <div className="flex items-center mb-8">
            <span className="font-semibold text-lg text-black dark:text-white">Dapper.</span>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-black dark:text-white">Sign in</h2>
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Email Address</Label>
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                  <Mail className="w-4 h-4" />
                </span>
                <Input
                  id="email"
                  type="email"
                  placeholder="Johndoe@gmail.com"
                  className="pl-10 pr-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-black dark:focus:ring-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Password</Label>
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                  <Lock className="w-4 h-4" />
                </span>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-black dark:focus:ring-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300 text-sm">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="form-checkbox rounded border-zinc-300 dark:border-zinc-600 focus:ring-black dark:focus:ring-white"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-zinc-500 hover:underline dark:text-zinc-300">
                Forgot Password
              </Link>
            </div>
            {/* Sign In Button */}
            <Button
              type="submit"
              className="w-full bg-black dark:bg-white text-white dark:text-black font-semibold rounded-lg py-2 mt-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
            {/* Sign Up Link */}
            <div className="text-center text-sm text-zinc-500 dark:text-zinc-300 mt-2">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-black dark:text-white hover:underline">Sign up</Link>
            </div>
          </form>
        </div>
      </div>
      {/* Right Side - Welcome Panel */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-black dark:bg-zinc-950 rounded-l-3xl p-12 relative overflow-hidden min-h-[600px]">
        <div className="max-w-md w-full text-white">
          <div className="flex items-center space-x-2 mb-8">
            <img src="/dapper.png" alt="Dapper Logo" className="w-10 h-10 rounded-lg bg-white p-1" />
            <span className="font-semibold text-lg">Dapper</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Welcome to Dapper</h2>
          <p className="text-zinc-300 mb-8">
            Dapper is your trusted marketplace for sustainable fashion. Buy, sell, and donate pre-loved clothing with ease. Join our community and make a positive impact on the planet—one outfit at a time.
          </p>
          <div className="mb-8">
            <span className="block text-zinc-400 text-sm mb-1">More than 17k people joined us, it's your turn</span>
          </div>
          <div className="bg-zinc-900/80 dark:bg-zinc-800/80 rounded-2xl p-6 mt-8 shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Fashion for Good</h3>
            <p className="text-zinc-300 mb-4">Be part of a movement that champions circular fashion and empowers communities. Discover unique styles, support local sellers, and help reduce waste.</p>
            <div className="flex items-center -space-x-2">
              <img src="/avatar1.png" alt="User 1" className="w-8 h-8 rounded-full border-2 border-white" />
              <img src="/avatar2.png" alt="User 2" className="w-8 h-8 rounded-full border-2 border-white" />
              <img src="/avatar3.png" alt="User 3" className="w-8 h-8 rounded-full border-2 border-white" />
              <span className="ml-4 text-sm text-zinc-300">+2</span>
            </div>
          </div>
        </div>
        {/* Decorative background shapes can be added here if desired */}
      </div>
    </div>
  );
};

export default SignIn;
