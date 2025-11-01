import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { useSignIn, useUser } from '@clerk/nextjs';
import { useApiClient } from '@/lib/useApiClient';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuthStore();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const { signIn, isLoaded, setActive } = useSignIn();
  const userCtx = useUser();

  const { callApi } = useApiClient();

  const waitForUser = async (timeout = 3000, interval = 100) => {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      if (userCtx.user) return userCtx.user;
      await new Promise(res => setTimeout(res, interval));
    }
    return undefined;
  };

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError(null);

    if (!isLoaded) {
      setError('Authentication is not loaded yet. Please try again.');
      setLoading(false);
      return;
    }

    try {
      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        const user = await waitForUser();
        if (user) {
          const userId = user.id;
          try { await callApi('/auth/profile', { method: 'POST', body: JSON.stringify({ userId }) }); } catch {}
        }
        router.push("/dashboard");
      } else {
        setError('Sign in failed. Please check your credentials and try again.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.errors?.[0]?.message || error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.15),transparent_50%)]" />
      </div>
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo and Branding */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-16 h-16 flex items-center justify-center">
              {/* SVG logo here */}
            </div>
            <span className="text-4xl font-bold text-white">Uncubed</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Welcome back
          </h1>
          <p className="text-gray-400 text-lg">
            Sign in to continue building your startup
          </p>
        </div>

        {/* Login Form Card */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20" />
          <div className="relative bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  placeholder="Email address"
                  className="input-glass w-full pl-12 pr-4 py-4 rounded-xl text-base"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="input-glass w-full pl-12 pr-12 py-4 rounded-xl text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5 text-[#EBB30B]" /> : <Eye className="w-5 h-5 text-[#EBB30B]" />}
                </button>
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 bg-transparent" />
                  <span className="ml-2 text-sm text-gray-400">Remember me</span>
                </label>
                <a href="#" className="text-sm text-blue-400 hover:text-blue-300">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full py-4 text-base font-semibold"
                loading={loading}
              >
                Sign In
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <a href="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Trusted by 10,000+ entrepreneurs worldwide
          </p>
        </div>
      </motion.div>
    </div>
  );
};
