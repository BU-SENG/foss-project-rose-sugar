import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Save, Trash2, Loader } from "lucide-react";

export default function Settings() {
  const [email, setEmail] = useState("alex@example.com");
  const [firstName, setFirstName] = useState("Alex");
  const [lastName, setLastName] = useState("Johnson");
  const [currency, setCurrency] = useState("USD");
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [error, setError] = useState(null);

  const CURRENCY_OPTIONS = {
    USD: { symbol: "$", name: "US Dollar" },
    EUR: { symbol: "€", name: "Euro" },
    GBP: { symbol: "£", name: "British Pound" },
    CAD: { symbol: "C$", name: "Canadian Dollar" },
    NGN: { symbol: "₦", name: "Nigerian Naira" },
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaveMessage("");
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSaveMessage("Settings saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      setError("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (
      confirm(
        "Are you sure? This action cannot be undone. All your data will be deleted permanently."
      )
    ) {
      console.log("Account deletion requested");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 md:p-8 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Settings
          </h1>
          <p className="text-slate-400">Manage your account and preferences</p>
        </div>

        {/* Success Alert */}
        {saveMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <p className="text-emerald-300 text-sm font-medium">
              {saveMessage}
            </p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 backdrop-blur-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Account Settings Card */}
        <div className="relative p-8 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 backdrop-blur-xl overflow-hidden mb-6">
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-700/50">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
              <div>
                <h2 className="text-xl font-black text-white">
                  Account Settings
                </h2>
                <p className="text-slate-400 text-sm">
                  Update your personal information
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* First Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-200">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-700/30 border border-slate-600/50 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 hover:border-slate-500/70"
                  placeholder="Enter your first name"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-200">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-700/30 border border-slate-600/50 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 hover:border-slate-500/70"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2 mb-6">
              <label className="block text-sm font-semibold text-slate-200">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-700/30 border border-slate-600/50 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 hover:border-slate-500/70"
                placeholder="Enter your email address"
              />
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-700/30 border border-slate-600/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 hover:border-slate-500/70 appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23a8b2c1' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: "right 0.75rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.5em 1.5em",
                  paddingRight: "2.5rem",
                }}
              >
                {Object.entries(CURRENCY_OPTIONS).map(
                  ([code, { symbol, name }]) => (
                    <option key={code} value={code} className="bg-slate-800">
                      {symbol} {code} - {name}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Danger Zone Card */}
        <div className="relative p-8 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/30 backdrop-blur-xl overflow-hidden">
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-red-500/20 to-red-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-start gap-3 mb-6 pb-6 border-b border-red-500/20">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-black text-red-300">Danger Zone</h2>
                <p className="text-red-300/70 text-sm">
                  Irreversible actions - proceed with caution
                </p>
              </div>
            </div>

            <p className="text-red-200/70 text-sm mb-6">
              Deleting your account will permanently remove all your data,
              including transactions, budgets, and settings. This action cannot
              be undone.
            </p>

            <button
              onClick={handleDeleteAccount}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-300 font-semibold hover:bg-red-500/30 hover:border-red-500/70 transition-all duration-200"
            >
              <Trash2 className="w-5 h-5" />
              Delete Account
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={handleSaveSettings}
            disabled={loading}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
