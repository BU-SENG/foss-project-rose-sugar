import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionsAPI, budgetsAPI } from '../services/api';

const CATEGORY_DISPLAY_NAMES = {
  'food': 'Food & Groceries',
  'transport': 'Transport',
  'entertainment': 'Entertainment',
  'utilities': 'Utilities',
  'education': 'Education',
  'health': 'Health & Medical',
  'shopping': 'Shopping',
  'other': 'Other'
};

const CATEGORY_SUGGESTIONS = {
  'food': ['Groceries', 'Coffee', 'Restaurant'],
  'transport': ['Bus Pass', 'Gas', 'Taxi'],
  'shopping': ['Clothes', 'Electronics', 'Books'],
  'entertainment': ['Movie', 'Concert', 'Gaming'],
  'education': ['Tuition', 'Books', 'Course'],
  'health': ['Doctor', 'Medicine', 'Gym'],
  'utilities': ['Electric', 'Water', 'Internet'],
  'other': ['Miscellaneous']
};

export default function AddExpense() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [budgetCategories, setBudgetCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const navigate = useNavigate();

  // Fetch budget categories on component mount
  useEffect(() => {
    const fetchBudgetCategories = async () => {
      try {
        setLoadingCategories(true);
        const result = await budgetsAPI.getAll();
        if (result.success && Array.isArray(result.data)) {
          setBudgetCategories(result.data.map(b => b.category));
        }
      } catch (err) {
        console.error('Error fetching budget categories:', err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchBudgetCategories();
  }, []);

  const aiSuggestions = category ? CATEGORY_SUGGESTIONS[category] || [] : [];

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!description || !amount || !category || !date) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await transactionsAPI.create({
        type: 'expense',
        category: category,
        amount: parseFloat(amount),
        description,
        date
      });

      if (result.success) {
        // Reset form
        setDescription('');
        setAmount('');
        setDate(new Date().toISOString().split('T')[0]);
        setCategory('');
        setSelectedSuggestion(null);
        navigate('/');
      } else {
        setError(result.error || 'Failed to add expense');
      }
    } catch (err) {
      console.error('Error adding expense:', err);
      setError('Error adding expense');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleSuggestionClick = (suggestion) => {
    setDescription(suggestion);
    setSelectedSuggestion(suggestion);
  };

  return (
    <main className="flex-1 p-8">
      <div className="mx-auto max-w-4xl">
        {/* Page-Heading */}
        <div className="mb-8">
          <div className="flex min-w-72 flex-col gap-2">
            <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-gray-900 dark:text-white">
              Log a New Expense
            </h1>
            <p className="text-base font-normal leading-normal text-gray-500 dark:text-[#92b2c9]">
              Fill in the details below to add a new expense to your tracker.
            </p>
          </div>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-500/20 rounded-xl p-4 border border-red-200 dark:border-red-500/50">
            <p className="text-red-700 dark:text-red-300">⚠️ {error}</p>
          </div>
        )}

        {/* Form Card */}
        <div className="rounded-xl border border-gray-200 dark:border-[#325167] bg-white dark:bg-[#111b22] p-6 shadow-sm">
          <form onSubmit={handleAddExpense} className="flex flex-col gap-6">
            {/* Description TextField */}
            <div className="flex flex-col">
              <label className="pb-2 text-base font-medium text-gray-800 dark:text-white" htmlFor="description">
                Description
              </label>
              <textarea
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 bg-gray-50 p-[15px] text-base font-normal leading-normal text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-[#325167] dark:bg-[#192833] dark:text-white dark:placeholder:text-[#92b2c9] dark:focus:border-primary"
                id="description"
                placeholder="e.g., Coffee with friends, Monthly bus pass"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            {/* Amount & Date Fields */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Amount TextField */}
              <div className="flex flex-col">
                <label className="pb-2 text-base font-medium text-gray-800 dark:text-white" htmlFor="amount">
                  Amount
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <span className="text-gray-500 dark:text-[#92b2c9]">$</span>
                  </div>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 bg-gray-50 h-14 p-[15px] pl-8 text-base font-normal leading-normal text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-[#325167] dark:bg-[#192833] dark:text-white dark:placeholder:text-[#92b2c9] dark:focus:border-primary"
                    id="amount"
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>

              {/* Date TextField */}
              <div className="flex flex-col">
                <label className="pb-2 text-base font-medium text-gray-800 dark:text-white" htmlFor="date">
                  Date
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <span className="text-xl">📅</span>
                  </div>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 bg-gray-50 h-14 p-[15px] pl-12 text-base font-normal leading-normal text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-[#325167] dark:bg-[#192833] dark:text-white dark:placeholder:text-[#92b2c9] dark:focus:border-primary"
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Category Field with AI Suggestions */}
            <div>
              {/* Category TextField */}
              <div className="flex flex-col">
                <label className="pb-2 text-base font-medium text-gray-800 dark:text-white" htmlFor="category">
                  Category
                </label>
                {loadingCategories ? (
                  <div className="flex items-center justify-center h-14 rounded-lg border border-gray-300 dark:border-[#325167] bg-gray-50 dark:bg-[#192833]">
                    <p className="text-gray-500 dark:text-[#92b2c9]">Loading categories...</p>
                  </div>
                ) : budgetCategories.length === 0 ? (
                  <div className="flex items-center justify-center h-14 rounded-lg border border-gray-300 dark:border-[#325167] bg-gray-50 dark:bg-[#192833]">
                    <p className="text-gray-500 dark:text-[#92b2c9]">No budget categories yet. Create a budget first!</p>
                  </div>
                ) : (
                  <select
                    className="form-select flex w-full min-w-0 flex-1 appearance-none resize-none overflow-hidden rounded-lg border border-gray-300 bg-gray-50 h-14 p-[15px] text-base font-normal leading-normal text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-[#325167] dark:bg-[#192833] dark:text-white dark:placeholder:text-[#92b2c9] dark:focus:border-primary"
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Select a category...</option>
                    {budgetCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {CATEGORY_DISPLAY_NAMES[cat] || cat}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* AI Suggestion Chips */}
              {aiSuggestions.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-500 dark:text-[#92b2c9]">Suggestions:</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {aiSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`cursor-pointer rounded-full px-3 py-1 text-sm font-medium transition ${
                        selectedSuggestion === suggestion
                          ? 'bg-primary text-white'
                          : 'bg-yellow-400/20 text-yellow-800 hover:bg-yellow-400/30 dark:bg-yellow-400/10 dark:text-yellow-300 dark:hover:bg-yellow-400/20'
                      }`}
                      type="button"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-800 pt-6">
              <button
                onClick={handleCancel}
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-5 bg-gray-100 text-gray-700 text-sm font-bold leading-normal hover:bg-gray-200 dark:bg-[#233948] dark:text-white dark:hover:bg-[#325167] transition"
                type="button"
              >
                <span className="truncate">Cancel</span>
              </button>
              <button
                disabled={loading}
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-5 bg-primary text-white text-sm font-bold leading-normal hover:bg-primary/90 transition disabled:opacity-50"
                type="submit"
              >
                <span className="truncate">{loading ? 'Adding...' : 'Log Expense'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
