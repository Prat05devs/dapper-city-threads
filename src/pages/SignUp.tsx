import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    bio: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\+?\d{10,15}$/.test(formData.phone)) newErrors.phone = 'Please enter a valid phone number';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.bio.trim()) newErrors.bio = 'Bio is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    try {
      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.fullName,
        formData.phone,
        formData.city
      );
      if (!error) {
        navigate('/signin', {
          state: { message: 'Account created successfully! Please check your email to verify your account.' }
        });
      }
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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
          <h2 className="text-2xl font-bold mb-2 text-black dark:text-white">Create Account</h2>
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            {/* Full Name */}
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Full Name</Label>
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                  <User className="w-4 h-4" />
                </span>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  className="pl-10 pr-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-black dark:focus:ring-white"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  required
                />
              </div>
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
            </div>
            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Email</Label>
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                  <Mail className="w-4 h-4" />
                </span>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10 pr-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-black dark:focus:ring-white"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            {/* Phone */}
            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Phone Number</Label>
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                  <Phone className="w-4 h-4" />
                </span>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  className="pl-10 pr-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-black dark:focus:ring-white"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </div>
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
            {/* City */}
            <div>
              <Label htmlFor="city" className="text-sm font-medium text-zinc-700 dark:text-zinc-200">City</Label>
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                  <MapPin className="w-4 h-4" />
                </span>
                <Input
                  id="city"
                  type="text"
                  placeholder="New York"
                  className="pl-10 pr-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-black dark:focus:ring-white"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  required
                />
              </div>
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>
            {/* Bio */}
            <div>
              <Label htmlFor="bio" className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Bio</Label>
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                  <Info className="w-4 h-4" />
                </span>
                <Textarea
                  id="bio"
                  placeholder="Tell us a bit about yourself..."
                  className="pl-10 pr-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-black dark:focus:ring-white min-h-[48px]"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  required
                />
              </div>
              {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
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
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
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
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            {/* Sign Up Button */}
            <Button
              type="submit"
              className="w-full bg-black dark:bg-white text-white dark:text-black font-semibold rounded-lg py-2 mt-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
            {/* Sign In Link */}
            <div className="text-center text-sm text-zinc-500 dark:text-zinc-300 mt-2">
              Already have an account?{' '}
              <Link to="/signin" className="font-medium text-black dark:text-white hover:underline">Sign in</Link>
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

export default SignUp; 