import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({
        email,
        password,
        password_confirm: password,
        first_name: fullName.split(' ')[0] || 'User',
        last_name: fullName.split(' ').slice(1).join(' ') || '',
      });

      if (response.success) {
        const userData = {
          email: response.data.user?.email || email,
          id: response.data.user?.id,
          first_name: response.data.user?.first_name,
          last_name: response.data.user?.last_name,
        };

        login(
          userData,
          response.data.access,
          response.data.refresh
        );

        navigate('/', { replace: true });
      } else {
        setError(response.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    // TODO: Add Google OAuth logic here
    console.log('Google Sign Up clicked');
  };

  return (
    <div className="dark">
      <div className="relative flex min-h-screen w-full flex-col bg-[#f8fafc] dark:bg-[#0f1419]">
        <div className="layout-container flex h-full grow flex-col">
          {/* Header */}
          <header className="flex items-center justify-between whitespace-nowrap px-6 py-4 md:px-10">
            <div className="flex items-center gap-3 text-slate-800 dark:text-white">
              <div className="size-6 text-blue-500">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_6_535)">
                    <path
                      clipRule="evenodd"
                      d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
                      fill="currentColor"
                      fillRule="evenodd"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_6_535">
                      <rect fill="white" height="48" width="48"></rect>
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">FinStudent</h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden text-sm text-slate-600 dark:text-slate-300 sm:inline">Already have an account?</span>
              <Link
                to="/login"
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-200 dark:bg-slate-700/50 text-slate-800 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors hover:bg-slate-300 dark:hover:bg-slate-700"
              >
                <span className="truncate">Log In</span>
              </Link>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-grow flex items-center justify-center p-4">
            <div className="grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-xl border border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm md:grid-cols-2">
              {/* Left Side - Marketing */}
              <div className="hidden flex-col justify-center gap-8 bg-slate-100 dark:bg-slate-900 p-8 text-center md:flex">
                <div className="flex flex-col gap-3">
                  <h1 className="text-3xl font-black leading-tight tracking-[-0.033em] text-slate-800 dark:text-white">
                    Master Your Money, Ace Your Studies.
                  </h1>
                  <p className="text-base font-normal leading-normal text-slate-600 dark:text-slate-400">
                    Take control of your finances and focus on what matters most.
                  </p>
                </div>
                <div className="relative mx-auto h-64 w-64">
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-blue-500/10">
                    <div className="h-56 w-56 rounded-full bg-blue-500/20"></div>
                  </div>
                  <img
                    className="absolute inset-0 h-full w-full object-cover rounded-full p-4"
                    alt="Stylized graphic of a student at a desk with financial icons"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4lFJhjnwr-PM6x8iCKx87GuRy0r7c7K3C4O-uemICbvSD1N-i_exGRgdP8iiPDZ3j-Nk4HefY2lPbzGaTCbEmaIsey8kuYAauOWj8yJN8vOuIGGHlqcLuctNlx4IJAovLUb65XJumhZ3fZqaiwP-_ta9c-F9cW-nWdRMFNqlQNkNmEsinE2BY3MFvf0R4Ow0SntC7MolQAXaJtoiuw4piwLaMdW5jiuSt832Y6SWCcekMym3hyA_fVRBN_f_Udot-i7W-Y0ibzTc"
                  />
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="flex flex-col justify-center p-8 sm:p-12">
                <div className="w-full max-w-md">
                  <div className="mb-8 flex flex-col gap-2 text-left">
                    <h1 className="text-2xl font-bold leading-tight tracking-[-0.033em] text-slate-800 dark:text-white sm:text-3xl">
                      Get Started for Free
                    </h1>
                    <p className="text-sm font-normal leading-normal text-slate-500 dark:text-slate-400">
                      Sign up to start tracking your budget today.
                    </p>
                  </div>

                  {/* Google Sign Up */}
                  <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={handleGoogleSignUp}
                      className="flex w-full min-w-[84px] items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M22.5777 12.2541C22.5777 11.4541 22.5077 10.6641 22.3677 9.89409H12.0077V14.3341H18.0477C17.7677 15.9341 16.9277 17.2941 15.6077 18.2341V20.9441H19.4677C21.4977 19.0941 22.5777 16.0341 22.5777 12.2541Z"
                          fill="#4285F4"
                        ></path>
                        <path
                          d="M12.0077 23.0002C15.1177 23.0002 17.7277 21.9302 19.4677 20.9402L15.6077 18.2302C14.5777 18.9102 13.3877 19.3102 12.0077 19.3102C9.37774 19.3102 7.14774 17.6202 6.33774 15.2902H2.36774V18.0902C4.18774 21.0502 7.79774 23.0002 12.0077 23.0002Z"
                          fill="#34A853"
                        ></path>
                        <path
                          d="M6.33774 15.2899C6.08774 14.5699 5.94774 13.7999 5.94774 12.9999C5.94774 12.1999 6.08774 11.4299 6.33774 10.7099V7.90991H2.36774C1.51774 9.59991 1.00774 11.2399 1.00774 12.9999C1.00774 14.7599 1.51774 16.3999 2.36774 18.0899L6.33774 15.2899Z"
                          fill="#FBBC05"
                        ></path>
                        <path
                          d="M12.0077 6.68018C13.5177 6.68018 14.9377 7.21018 16.0377 8.24018L19.5377 4.93018C17.7177 3.23018 15.1177 2.00018 12.0077 2.00018C7.79774 2.00018 4.18774 3.95018 2.36774 6.91018L6.33774 9.71018C7.14774 7.38018 9.37774 5.69018 12.0077 5.69018V6.68018Z"
                          fill="#EA4335"
                        ></path>
                      </svg>
                      <span className="truncate">Sign up with Google</span>
                    </button>
                  </div>

                  {/* Error Alert */}
                  {error && (
                    <div className="flex w-full items-center gap-3 rounded-lg bg-red-50 dark:bg-red-500/20 border border-red-200 dark:border-red-500/50 p-4 mb-4">
                      <span className="text-red-600 dark:text-red-400 text-lg">⚠️</span>
                      <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
                    </div>
                  )}

                  {/* Registration Form */}
                  <form onSubmit={handleRegister} className="flex flex-col gap-4">
                    {/* Full Name */}
                    <label className="flex flex-col w-full">
                      <p className="text-sm font-medium pb-2 text-slate-700 dark:text-slate-300">Full Name</p>
                      <input
                        type="text"
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 dark:text-white focus:outline-0 focus:ring-2 focus:ring-blue-500/50 border border-slate-300 dark:border-slate-700 bg-transparent h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-3 text-base font-normal leading-normal"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </label>

                    {/* Email */}
                    <label className="flex flex-col w-full">
                      <p className="text-sm font-medium pb-2 text-slate-700 dark:text-slate-300">Email</p>
                      <input
                        type="email"
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 dark:text-white focus:outline-0 focus:ring-2 focus:ring-blue-500/50 border border-slate-300 dark:border-slate-700 bg-transparent h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-3 text-base font-normal leading-normal"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </label>

                    {/* Password */}
                    <div className="relative">
                      <label className="flex flex-col w-full">
                        <p className="text-sm font-medium pb-2 text-slate-700 dark:text-slate-300">Password</p>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 dark:text-white focus:outline-0 focus:ring-2 focus:ring-blue-500/50 border border-slate-300 dark:border-slate-700 bg-transparent h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-3 pr-10 text-base font-normal leading-normal"
                          placeholder="Create a password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-[38px] text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition"
                      >
                        <span className="text-xl">{showPassword ? '👁️' : '👁️‍🗨️'}</span>
                      </button>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                      <label className="flex flex-col w-full">
                        <p className="text-sm font-medium pb-2 text-slate-700 dark:text-slate-300">Confirm Password</p>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-800 dark:text-white focus:outline-0 focus:ring-2 focus:ring-blue-500/50 border border-slate-300 dark:border-slate-700 bg-transparent h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-3 pr-10 text-base font-normal leading-normal"
                          placeholder="Confirm your password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-[38px] text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition"
                      >
                        <span className="text-xl">{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</span>
                      </button>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-4 flex min-w-[84px] max-w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-blue-500 text-white text-base font-bold leading-normal tracking-[0.015em] transition-colors hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="truncate">{loading ? 'Creating Account...' : 'Create My Free Account'}</span>
                    </button>
                  </form>

                  {/* Terms */}
                  <div className="mt-6 text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      By signing up, you agree to our{' '}
                      <a className="font-medium text-blue-500 hover:underline" href="#">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a className="font-medium text-blue-500 hover:underline" href="#">
                        Privacy Policy
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}