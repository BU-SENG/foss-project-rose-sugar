import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddExpense() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const navigate = useNavigate();

  const categories = [
    'Food & Drink',
    'Transportation',
    'Shopping',
    'Bills & Utilities',
    'Entertainment',
    'Education',
    'Healthcare',
    'Other'
  ];

  const aiSuggestions = ['Groceries', 'Transport', 'Entertainment', 'Food', 'Shopping'];

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!description || !amount || !category || !date) {
      alert('Please fill in all fields');
      return;
    }
    // TODO: Add expense to backend
    console.log({ description, amount, date, category });
    alert('Expense added successfully!');
    // Reset form
    setDescription('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setCategory('');
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleSuggestionClick = (suggestion) => {
    setCategory(suggestion);
    setSelectedSuggestion(suggestion);
  };

  return (
    <main className="flex-1 p-8">
      <div className="mx-auto max-w-4xl">
        {/* Page Heading */}
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
                <select
                  className="form-select flex w-full min-w-0 flex-1 appearance-none resize-none overflow-hidden rounded-lg border border-gray-300 bg-gray-50 h-14 p-[15px] text-base font-normal leading-normal text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-[#325167] dark:bg-[#192833] dark:text-white dark:placeholder:text-[#92b2c9] dark:focus:border-primary"
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select a category...</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* AI Suggestion Chips */}
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-500 dark:text-[#92b2c9]">AI Suggestions:</p>
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
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-5 bg-primary text-white text-sm font-bold leading-normal hover:bg-primary/90 transition"
                type="submit"
              >
                <span className="truncate">Log Expense</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
