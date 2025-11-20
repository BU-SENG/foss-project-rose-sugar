import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";

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
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

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

    try {
      // Split full name into first and last name
      const nameParts = fullName.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ");

      const registerData = {
        email,
        password,
        password_confirm: confirmPassword,
        first_name: firstName,
        last_name: lastName,
      };

      const response = await authAPI.register(registerData);

      if (response.success) {
        // Extract user data
        const userData = {
          email: response.data.user?.email || email,
          id: response.data.user?.id,
          first_name: response.data.user?.first_name,
          last_name: response.data.user?.last_name,
        };

        // Store tokens and user data
        login(userData, response.data.access, response.data.refresh);

        // Redirect to dashboard
        navigate("/", { replace: true });
      } else {
        setError(response.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "An error occurred during registration.");
      console.error("Register error:", err);
    } finally {
      setLoading(false);
    }
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

                {/* Form */}
                <form onSubmit={handleRegister} className="space-y-4">
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
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      "Create My Free Account"
                    )}
                  </button>
                </form>

                {/* Login Link */}
                <p className="mt-6 text-center text-sm text-slate-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-bold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
