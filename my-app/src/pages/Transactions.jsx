export default function Transactions() {
  const transactions = [
    { id: 1, date: '2024-11-17', name: 'Campus Cafeteria', category: 'Food', amount: -8.50, icon: '🍴' },
    { id: 2, date: '2024-11-17', name: 'Cinema Plex', category: 'Entertainment', amount: -15.00, icon: '🎭' },
    { id: 3, date: '2024-11-16', name: 'Metro Pass', category: 'Transport', amount: -2.75, icon: '🚇' },
    { id: 4, date: '2024-11-16', name: 'Bookstore', category: 'Supplies', amount: -42.30, icon: '🛍️' },
    { id: 5, date: '2024-11-15', name: 'Grocery Store', category: 'Food', amount: -35.20, icon: '🛒' },
    { id: 6, date: '2024-11-14', name: 'University Tuition', category: 'Education', amount: -500.00, icon: '🎓' },
  ];

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-[#111827] dark:text-white mb-2">Transactions</h1>
          <p className="text-[#6b7280] dark:text-[#92b2c9]">View all your recent transactions</p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <input type="text" placeholder="Search transactions..." className="flex-1 px-4 py-2 rounded-lg bg-[#fdfdff] dark:bg-[#111b22] border border-gray-300 dark:border-gray-700 text-[#111827] dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <select className="px-4 py-2 rounded-lg bg-[#fdfdff] dark:bg-[#111b22] border border-gray-300 dark:border-gray-700 text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Categories</option>
            <option>Food</option>
            <option>Transport</option>
            <option>Entertainment</option>
            <option>Education</option>
            <option>Supplies</option>
          </select>
        </div>

        {/* Transactions List */}
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
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-[#0d1117] transition">
                    <td className="px-6 py-4 text-sm text-[#6b7280] dark:text-[#92b2c9]">{transaction.date}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{transaction.icon}</span>
                        <span className="text-[#111827] dark:text-white font-medium">{transaction.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#6b7280] dark:text-[#92b2c9]">{transaction.category}</td>
                    <td className="px-6 py-4 text-sm text-right font-bold text-red-500">${Math.abs(transaction.amount).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
