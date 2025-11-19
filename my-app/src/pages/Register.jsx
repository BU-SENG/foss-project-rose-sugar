import { useState } from "react";
import { Eye, EyeOff, AlertCircle, Loader, CheckCircle } from "lucide-react";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!agreeTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const passwordStrength =
    password.length >= 8 ? "strong" : password.length >= 4 ? "medium" : "weak";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl relative z-10">
        {/* Left Side - Marketing */}
        <div className="hidden lg:flex flex-col justify-center items-center relative">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-3xl blur-2xl"></div>

            <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-12 shadow-2xl">
              <div className="flex flex-col items-center gap-8 max-w-sm">
                <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-2xl">
                  <span className="text-7xl">📚</span>
                </div>

                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-black text-white leading-tight">
                    Master Your Money, Ace Your Studies
                  </h2>
                  <p className="text-slate-300 text-base">
                    Join thousands of students managing their finances smarter.
                  </p>

                  <div className="pt-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">
                        Track spending effortlessly
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">
                        Build smarter budgets
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">
                        Reach your financial goals
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>

              <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                {/* Logo for mobile */}
                <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-2xl">💼</span>
                  </div>
                  <span className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    FinStudent
                  </span>
                </div>

                {/* Welcome Text */}
                <div className="mb-8">
                  <h1 className="text-3xl font-black text-white mb-2">
                    Get Started
                  </h1>
                  <p className="text-slate-400 text-sm">
                    Create your account in less than a minute
                  </p>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 backdrop-blur-sm flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-300 text-sm font-medium">{error}</p>
                  </div>
                )}

                {/* Google Sign Up */}
                <button className="w-full py-3 px-4 rounded-xl bg-slate-700/30 border border-slate-600/50 text-slate-300 font-semibold hover:bg-slate-700/50 hover:border-slate-500/70 transition-all duration-200 flex items-center justify-center gap-2 mb-6">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
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
                  Sign up with Google
                </button>

                {/* Divider */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full h-px bg-gradient-to-r from-slate-700/0 via-slate-600/50 to-slate-700/0"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gradient-to-br from-slate-800/80 to-slate-800/40 text-slate-400 text-xs font-medium">
                      Or continue with email
                    </span>
                  </div>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-200">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-700/30 border border-slate-600/50 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 hover:border-slate-500/70"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-200">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-700/30 border border-slate-600/50 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 hover:border-slate-500/70"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-200">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-700/30 border border-slate-600/50 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 hover:border-slate-500/70"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {password && (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 rounded-full bg-slate-700/30 overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              passwordStrength === "weak"
                                ? "w-1/3 bg-red-500"
                                : passwordStrength === "medium"
                                ? "w-2/3 bg-yellow-500"
                                : "w-full bg-emerald-500"
                            }`}
                          ></div>
                        </div>
                        <span
                          className={`text-xs font-semibold ${
                            passwordStrength === "weak"
                              ? "text-red-400"
                              : passwordStrength === "medium"
                              ? "text-yellow-400"
                              : "text-emerald-400"
                          }`}
                        >
                          {passwordStrength === "weak"
                            ? "Weak"
                            : passwordStrength === "medium"
                            ? "Medium"
                            : "Strong"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-200">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-700/30 border border-slate-600/50 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 hover:border-slate-500/70"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-start gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-5 h-5 rounded bg-slate-700/30 border border-slate-600/50 text-blue-500 focus:ring-2 focus:ring-blue-500/50 cursor-pointer mt-0.5"
                    />
                    <label
                      htmlFor="terms"
                      className="text-xs text-slate-400 cursor-pointer leading-tight"
                    >
                      I agree to the{" "}
                      <a
                        href="#"
                        className="text-blue-400 hover:text-blue-300 transition-colors font-semibold"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-blue-400 hover:text-blue-300 transition-colors font-semibold"
                      >
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  {/* Sign Up Button */}
                  <button
                    onClick={handleRegister}
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      "Create My Free Account"
                    )}
                  </button>
                </div>

                {/* Login Link */}
                <p className="mt-6 text-center text-sm text-slate-400">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="font-bold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Sign In
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
