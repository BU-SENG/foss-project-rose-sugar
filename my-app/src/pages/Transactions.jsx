import { useState, useMemo, useEffect } from 'react';
import { transactionsAPI } from '../services/api';
import { formatCurrency, getCurrency } from '../utils/currency';

export default function Transactions() {
  const [currency, setCurrency] = useState(getCurrency());
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const CATEGORY_CHOICES = {
    'food': 'Food & Groceries',
    'transport': 'Transport',
    'entertainment': 'Entertainment',
    'utilities': 'Utilities',
    'education': 'Education',
    'health': 'Health & Medical',
    'shopping': 'Shopping',
    'other': 'Other',
  };

  const CATEGORY_ICONS = {
    'food': '🍴',
    'transport': '🚇',
    'entertainment': '🎭',
    'utilities': '⚡',
    'education': '🎓',
    'health': '⚕️',
    'shopping': '🛍️',
    'other': '📝',
  };

  // Mock data fallback
  const defaultTransactions = [
    { id: 1, date: '2024-11-17', description: 'Campus Cafeteria', category: 'food', amount: 8.50, type: 'expense' },
    { id: 2, date: '2024-11-17', description: 'Cinema Plex', category: 'entertainment', amount: 15.00, type: 'expense' },
    { id: 3, date: '2024-11-16', description: 'Metro Pass', category: 'transport', amount: 2.75, type: 'expense' },
    { id: 4, date: '2024-11-16', description: 'Bookstore', category: 'shopping', amount: 42.30, type: 'expense' },
    { id: 5, date: '2024-11-15', description: 'Grocery Store', category: 'food', amount: 35.20, type: 'expense' },
    { id: 6, date: '2024-11-14', description: 'University Tuition', category: 'education', amount: 500.00, type: 'expense' },
  ];

  // Listen for currency changes
  useEffect(() => {
    const handleStorageChange = () => {
      setCurrency(getCurrency());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const result = await transactionsAPI.getAll();
        console.log('Transactions API result:', result);
        
        if (result.success && Array.isArray(result.data)) {
          setTransactions(result.data);
          setError(null);
        } else {
          setError('Failed to load transactions');
          setTransactions(defaultTransactions);
        }
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Error loading transactions');
        setTransactions(defaultTransactions);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filtered = useMemo(() => {
    if (!Array.isArray(transactions)) {
      return [];
    }

    const q = query.trim().toLowerCase();
    return transactions.filter((t) => {
      const transactionCategory = CATEGORY_CHOICES[t.category] || t.category || '';
      
      if (category !== 'All Categories' && transactionCategory !== category) return false;
      if (!q) return true;
      return (
        (t.description || '').toLowerCase().includes(q) ||
        transactionCategory.toLowerCase().includes(q) ||
        (t.date || '').toLowerCase().includes(q)
      );
    });
  }, [query, category, transactions]);

  const categoryOptions = ['All Categories', ...Object.values(CATEGORY_CHOICES)];

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-[#111827] dark:text-white mb-2">Transactions</h1>
          <p className="text-[#6b7280] dark:text-[#92b2c9]">View all your recent transactions</p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search transactions..."
            className="flex-1 px-4 py-2 rounded-lg bg-[#fdfdff] dark:bg-[#111b22] border border-gray-300 dark:border-gray-700 text-[#111827] dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 rounded-lg bg-[#fdfdff] dark:bg-[#111b22] border border-gray-300 dark:border-gray-700 text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-[#fdfdff] dark:bg-[#111b22] rounded-xl shadow-sm p-8 text-center">
            <p className="text-[#6b7280] dark:text-[#92b2c9]">Loading transactions...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-yellow-50 dark:bg-yellow-500/20 rounded-xl shadow-sm p-4 mb-6 border border-yellow-200 dark:border-yellow-500/50">
            <p className="text-yellow-700 dark:text-yellow-300">⚠️ {error}</p>
          </div>
        )}

        {/* Transactions List */}
        {!loading && (
          <div className="bg-[#fdfdff] dark:bg-[#111b22] rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-[#0d1117]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#111827] dark:text-white">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#111827] dark:text-white">Description</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#111827] dark:text-white">Category</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-[#111827] dark:text-white">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filtered.length > 0 ? (
                    filtered.map((transaction) => {
                      const catLabel = CATEGORY_CHOICES[transaction.category] || transaction.category;
                      const catIcon = CATEGORY_ICONS[transaction.category] || '📝';
                      
                      return (
                        <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-[#0d1117] transition">
                          <td className="px-6 py-4 text-sm text-[#6b7280] dark:text-[#92b2c9]">{transaction.date}</td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{catIcon}</span>
                              <span className="text-[#111827] dark:text-white font-medium">{transaction.description}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-[#6b7280] dark:text-[#92b2c9]">{catLabel}</td>
                          <td className="px-6 py-4 text-sm text-right font-bold text-red-500">
                            {formatCurrency(parseFloat(transaction.amount), currency)}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-[#6b7280] dark:text-[#92b2c9]">
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
