import { useState, useMemo, useEffect } from "react";
import { transactionsAPI, budgetsAPI } from "../services/api";
import { formatCurrency, getCurrency } from "../utils/currency";

export default function Transactions() {
  const [currency, setCurrency] = useState(getCurrency());
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [transactions, setTransactions] = useState([]);
  const [budgetCategories, setBudgetCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const CATEGORY_CHOICES = {
    food: "Food & Groceries",
    transport: "Transport",
    entertainment: "Entertainment",
    utilities: "Utilities",
    education: "Education",
    health: "Health & Medical",
    shopping: "Shopping",
    salary: "Salary",
    freelance: "Freelance",
    scholarship: "Scholarship",
    "part-time job": "Part-time Job",
    internship: "Internship",
    bonus: "Bonus",
    investment: "Investment",
    gift: "Gift",
    allowance: "Allowance",
    other: "Other",
  };

  const CATEGORY_ICONS = {
    food: "🍴",
    transport: "🚇",
    entertainment: "🎭",
    utilities: "⚡",
    education: "🎓",
    health: "⚕️",
    shopping: "🛍️",
    other: "📝",
  };

  const fallbackTransactions = [
    { id: 1, date: "2024-11-17", description: "Campus Cafeteria", category: "food", amount: 8.5, type: "expense" },
    { id: 2, date: "2024-11-17", description: "Cinema Plex", category: "entertainment", amount: 15, type: "expense" },
    { id: 3, date: "2024-11-16", description: "Metro Pass", category: "transport", amount: 2.75, type: "expense" },
    { id: 4, date: "2024-11-16", description: "Bookstore", category: "shopping", amount: 42.3, type: "expense" },
    { id: 5, date: "2024-11-15", description: "Grocery Store", category: "food", amount: 35.2, type: "expense" },
    { id: 6, date: "2024-11-14", description: "University Tuition", category: "education", amount: 500, type: "expense" },
  ];

  // Listen for currency changes
  useEffect(() => {
    const refreshCurrency = () => setCurrency(getCurrency());
    window.addEventListener("storage", refreshCurrency);
    return () => window.removeEventListener("storage", refreshCurrency);
  }, []);

  // Fetch budget + transactions
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const budgetRes = await budgetsAPI.getAll();
        if (budgetRes.success && Array.isArray(budgetRes.data)) {
          setBudgetCategories(budgetRes.data.map((b) => b.category));
        }

        const txRes = await transactionsAPI.getAll();
        if (txRes.success && Array.isArray(txRes.data)) {
          setTransactions(txRes.data);
          setError(null);
        } else {
          setTransactions(fallbackTransactions);
          setError("Failed to load transactions");
        }
      } catch (e) {
        setTransactions(fallbackTransactions);
        setError("Error loading transactions");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter logic
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return transactions.filter((t) => {
      const displayCat = CATEGORY_CHOICES[t.category] || t.category || "";

      if (category !== "All Categories" && displayCat !== category) return false;
      if (!q) return true;

      return (
        t.description?.toLowerCase().includes(q) ||
        displayCat.toLowerCase().includes(q) ||
        t.date?.toLowerCase().includes(q)
      );
    });
  }, [query, category, transactions]);

  // Build category dropdown 
  const categoryOptions = useMemo(() => {
    const options = ["All Categories"];
    budgetCategories.forEach((c) => {
      const name = CATEGORY_CHOICES[c] || c;
      if (!options.includes(name)) options.push(name);
    });
    return options;
  }, [budgetCategories]);

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <header className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">Transactions</h1>
          <p className="text-gray-500 dark:text-gray-400">View all your recent transactions</p>
        </header>

        {/* FILTER */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search transactions..."
            className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 
                       text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 
                       text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            {categoryOptions.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">Loading transactions...</p>
          </div>
        )}

        {/* ERROR */}
        {error && !loading && (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 
                          rounded-xl p-4 mb-6">
            <p className="text-yellow-700 dark:text-yellow-300 font-medium">⚠️ {error}</p>
          </div>
        )}

        {/* TABLE */}
        {!loading && (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    {["Date", "Description", "Category", "Amount"].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filtered.length > 0 ? (
                    filtered.map((t) => {
                      const catName = CATEGORY_CHOICES[t.category] || t.category;
                      const icon = CATEGORY_ICONS[t.category] || "📝";

                      return (
                        <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{t.date}</td>

                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{icon}</span>
                              <span className="text-gray-900 dark:text-white font-medium">{t.description}</span>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{catName}</td>

                          <td className="px-6 py-4 text-sm text-right font-bold text-red-500">
                            {formatCurrency(Number(t.amount), currency)}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
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
