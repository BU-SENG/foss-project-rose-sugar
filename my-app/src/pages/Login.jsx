import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      
      if (response.success) {
        const userData = {
          email: response.data.user?.email || email,
          id: response.data.user?.id,
          name: response.data.user?.name,
        };
        
        login(
          userData,
          response.data.access,
          response.data.refresh
        );
        
        navigate('/');
      } else {
        setError(response.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 items-stretch justify-center">
          <div className="layout-content-container flex w-full flex-1">
            <div className="grid w-full grow grid-cols-1 lg:grid-cols-2">
              {/* Left Side - Illustration */}
              <div className="relative hidden items-center justify-center bg-background-light dark:bg-background-dark lg:flex">
                <div className="absolute inset-0 bg-primary/10"></div>
                <div className="relative w-full max-w-md p-8">
                  <div className="w-full gap-1 overflow-hidden bg-transparent aspect-square rounded-lg flex">
                    <div
                      className="w-full bg-center bg-no-repeat bg-contain"
                      style={{
                        backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD2CUgL7HrJj5Bocrxwjyr2aT2nlxKgC6fzz7dibptB47MLgiPGClM4rlrfbgE8zVKeOVTLBAZXS2YXD-yMBJqvD-D33IjDDeEJGxkWUNGdKkryBCnZsMeSnM4Z-nkHMdQoOqPCemICxAO2CpR4a2ToJTObZP4KK6luQSZQBNmZ7HuHyZ9TcoSRcZSIGRORqjN_h0sWJXn5ZDLILqZS5um-rpHgx9_4KFiuGbrsGOmn3FblUqmEWpWvOsQlbdm-KsztrqUsc70NRnc")',
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Right Side - Login Form */}
              <div className="flex w-full items-center justify-center bg-background-light dark:bg-background-dark p-6 md:p-12">
                <div className="flex w-full max-w-md flex-col items-start gap-6">
                  {/* Logo */}
                  <div className="flex items-center gap-3">
                    <span className="text-primary text-4xl">💼</span>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">FinStudent</p>
                  </div>

                  {/* Welcome Text */}
                  <div className="flex flex-col items-start gap-2">
                    <h1 className="text-gray-900 dark:text-white text-3xl font-bold leading-tight">Welcome Back</h1>
                    <p className="text-gray-600 dark:text-gray-300 text-base font-normal">Smart budgeting starts here.</p>
                  </div>

                  {/* Error Alert */}
                  {error && (
                    <div className="flex w-full items-center gap-3 rounded-lg bg-red-50 dark:bg-red-500/20 border border-red-200 dark:border-red-500/50 p-4">
                      <span className="text-red-600 dark:text-red-400 text-lg">⚠️</span>
                      <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleLogin} className="flex w-full flex-col items-stretch gap-4">
                    {/* Email Field */}
                    <div className="flex max-w-full flex-wrap items-end gap-4">
                      <label className="flex flex-col min-w-40 flex-1">
                        <p className="text-gray-700 dark:text-white text-base font-medium leading-normal pb-2">Email</p>
                        <input
                          type="email"
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-[#325167] bg-white dark:bg-[#192833] focus:border-primary dark:focus:border-primary h-14 placeholder:text-gray-400 dark:placeholder:text-[#92b2c9] p-[15px] text-base font-normal leading-normal"
                          placeholder="Enter your email or username"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </label>
                    </div>

                    {/* Password Field */}
                    <div className="flex max-w-full flex-wrap items-end gap-4">
                      <label className="flex flex-col min-w-40 flex-1">
                        <div className="flex w-full items-center justify-between pb-2">
                          <p className="text-gray-700 dark:text-white text-base font-medium leading-normal">Password</p>
                          <a className="text-sm font-medium text-primary hover:underline" href="#">
                            Forgot Password?
                          </a>
                        </div>
                        <div className="flex w-full flex-1 items-stretch rounded-lg">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-lg text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-[#325167] bg-white dark:bg-[#192833] focus:border-primary dark:focus:border-primary h-14 placeholder:text-gray-400 dark:placeholder:text-[#92b2c9] p-[15px] border-r-0 text-base font-normal leading-normal"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-500 dark:text-[#92b2c9] flex border border-gray-300 dark:border-[#325167] bg-white dark:bg-[#192833] items-center justify-center px-4 rounded-r-lg border-l-0 focus:outline-0 focus:ring-2 focus:ring-primary/50 focus:border-primary dark:focus:border-primary hover:text-gray-700 dark:hover:text-white transition"
                          >
                            <span className="text-xl">{showPassword ? '👁️' : '👁️‍🗨️'}</span>
                          </button>
                        </div>
                      </label>
                    </div>

                    {/* Login Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center justify-center rounded-lg h-14 px-6 text-base font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark w-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Logging in...' : 'Log In'}
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>

                  {/* Sign Up Link */}
                  <p className="text-center text-sm text-gray-600 dark:text-gray-400 w-full">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-bold text-primary hover:underline">
                      Sign Up
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
