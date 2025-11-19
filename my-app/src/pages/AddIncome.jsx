import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionsAPI } from '../services/api';

const INCOME_SOURCES = [
  'Salary',
  'Freelance',
  'Scholarship',
  'Part-time Job',
  'Internship',
  'Bonus',
  'Investment',
  'Gift',
  'Allowance',
  'Other'
];

export default function AddIncome() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('Salary');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleAddIncome = async (e) => {
    e.preventDefault();
    if (!description || !amount || !source || !date) {
      setError('Please fill in all fields');
      return;
    }

    if (parseFloat(amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await transactionsAPI.create({
        type: 'income',
        category: source.toLowerCase(),
        amount: parseFloat(amount),
        description,
        date
      });

      if (result.success) {
        setSuccess(true);
        // Reset form
        setDescription('');
        setAmount('');
        setSource('Salary');
        setDate(new Date().toISOString().split('T')[0]);
        
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError(result.error || 'Failed to log income');
      }
    } catch (err) {
      console.error('Error adding income:', err);
      setError('Error logging income');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-[#111827] dark:text-white mb-2">Log Income</h1>
          <p className="text-[#6b7280] dark:text-[#92b2c9]">Track your income sources and stay on top of your earnings</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-500/20 rounded-xl p-4 border border-red-200 dark:border-red-500/50">
            <p className="text-red-700 dark:text-red-300">⚠️ {error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 dark:bg-green-500/20 rounded-xl p-4 border border-green-200 dark:border-green-500/50">
            <p className="text-green-700 dark:text-green-300">✅ Income logged successfully! Redirecting...</p>
          </div>
        )}

        <div className="bg-[#fdfdff] dark:bg-[#111b22] rounded-xl p-6 shadow-sm">
          <form onSubmit={handleAddIncome} className="space-y-6">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Monthly Salary, Freelance Project"
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 text-[#111827] dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Income Source */}
            <div>
              <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">Income Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {INCOME_SOURCES.map((src) => (
                  <option key={src} value={src}>
                    {src}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 text-[#111827] dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium disabled:opacity-50"
              >
                {loading ? 'Saving...' : '✅ Log Income'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 px-6 py-3 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-500/10 rounded-xl p-6 border border-blue-200 dark:border-blue-500/50">
          <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-3">💡 Income Tracking Tips</h3>
          <ul className="space-y-2 text-blue-800 dark:text-blue-200 text-sm">
            <li>✓ Log all sources of income including salary, freelance work, and scholarships</li>
            <li>✓ Use descriptive names so you can track patterns over time</li>
            <li>✓ Include the date you received the income for accurate tracking</li>
            <li>✓ Check your Dashboard to see total income and financial overview</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
