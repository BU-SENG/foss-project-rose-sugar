import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCurrency, setCurrency as saveCurrency, CURRENCY_OPTIONS } from '../utils/currency';

export default function Settings() {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [theme, setTheme] = useState('dark');
  const [budgetNotifications, setBudgetNotifications] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [transactionUpdates, setTransactionUpdates] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
    }
    // Load saved currency from localStorage
    setCurrency(getCurrency());
  }, [user]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaveMessage('');
    setError(null);

    try {
      // Save currency preference to localStorage
      saveCurrency(currency);
      
      // In a real app, this would call an API endpoint to save user preferences
      // For now, we'll just show a success message after a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setError('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure? This action cannot be undone. All your data will be deleted.')) {
      // In a real app, this would call an API endpoint to delete the account
      console.log('Account deletion requested');
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-[#111827] dark:text-white mb-2">Settings</h1>
          <p className="text-[#6b7280] dark:text-[#92b2c9]">Manage your account preferences</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-500/20 rounded-xl p-4 border border-red-200 dark:border-red-500/50">
            <p className="text-red-700 dark:text-red-300">⚠️ {error}</p>
          </div>
        )}

        {saveMessage && (
          <div className="mb-6 bg-green-50 dark:bg-green-500/20 rounded-xl p-4 border border-green-200 dark:border-green-500/50">
            <p className="text-green-700 dark:text-green-300">✅ {saveMessage}</p>
          </div>
        )}

        {/* Account Settings */}
        <div className="bg-[#fdfdff] dark:bg-[#111b22] rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-[#111827] dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">Account Settings</h2>

          <div className="space-y-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">{CURRENCY_OPTIONS.USD.symbol} USD - {CURRENCY_OPTIONS.USD.name}</option>
                <option value="EUR">{CURRENCY_OPTIONS.EUR.symbol} EUR - {CURRENCY_OPTIONS.EUR.name}</option>
                <option value="GBP">{CURRENCY_OPTIONS.GBP.symbol} GBP - {CURRENCY_OPTIONS.GBP.name}</option>
                <option value="CAD">{CURRENCY_OPTIONS.CAD.symbol} CAD - {CURRENCY_OPTIONS.CAD.name}</option>
                <option value="NGN">{CURRENCY_OPTIONS.NGN.symbol} NGN - {CURRENCY_OPTIONS.NGN.name}</option>
              </select>
            </div>

            
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 dark:bg-red-500/10 rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4">Danger Zone</h2>
          <p className="text-sm text-[#6b7280] dark:text-[#92b2c9] mb-4">Irreversible actions</p>
          <button 
            onClick={handleDeleteAccount}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
          >
            Delete Account
          </button>
        </div>

        {/* Save Button */}
        <div className="flex gap-4">
          <button 
            onClick={handleSaveSettings}
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
