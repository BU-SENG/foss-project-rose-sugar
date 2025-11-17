import { useState } from 'react';

export default function Settings() {
  const [email, setEmail] = useState('alex.doe@university.edu');
  const [currency, setCurrency] = useState('USD');
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-[#111827] dark:text-white mb-2">Settings</h1>
          <p className="text-[#6b7280] dark:text-[#92b2c9]">Manage your account preferences</p>
        </div>

        {/* Account Settings */}
        <div className="bg-[#fdfdff] dark:bg-[#111b22] rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-[#111827] dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">Account Settings</h2>

          <div className="space-y-6">
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
                <option>USD - US Dollar</option>
                <option>EUR - Euro</option>
                <option>GBP - British Pound</option>
                <option>CAD - Canadian Dollar</option>
              </select>
            </div>

            {/* Theme */}
            <div>
              <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">Theme</label>
              <select className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Dark Mode (Current)</option>
                <option>Light Mode</option>
                <option>Auto (System)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-[#fdfdff] dark:bg-[#111b22] rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-[#111827] dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">Notifications</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#111827] dark:text-white">Budget Alerts</p>
                <p className="text-sm text-[#6b7280] dark:text-[#92b2c9]">Get notified when you're close to your budget limit</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#111827] dark:text-white">Weekly Reports</p>
                <p className="text-sm text-[#6b7280] dark:text-[#92b2c9]">Receive weekly spending reports</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[#111827] dark:text-white">Transaction Updates</p>
                <p className="text-sm text-[#6b7280] dark:text-[#92b2c9]">Get notified of all transactions</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="w-5 h-5" />
              </label>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 dark:bg-red-500/10 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4">Danger Zone</h2>
          <p className="text-sm text-[#6b7280] dark:text-[#92b2c9] mb-4">Irreversible actions</p>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium">
            Delete Account
          </button>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex gap-4">
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium">
            Save Changes
          </button>
          <button className="px-6 py-2 bg-gray-300 dark:bg-gray-700 text-[#111827] dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition font-medium">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
