import React from 'react';

export default function Reports() {
  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Heading & Actions */}
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-text-light-headings dark:text-white text-3xl font-bold">Financial Reports</p>
            <p className="text-text-light-body dark:text-text-dark-body text-base">An overview of your spending patterns and financial health.</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 hover:bg-primary/10">
              <p className="text-sm font-medium">Last 30 Days</p>
            </button>
            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-primary px-3 text-white hover:bg-primary/90">
              <span className="text-base">⬇️</span>
              <p className="text-sm font-medium">Export Report</p>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Total Spent</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">$450.75</p>
            <p className="text-red-500 text-sm font-medium flex items-center gap-1">⬆️ 5.2% vs last month</p>
          </div>

          <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Remaining Budget</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">$349.25</p>
            <p className="text-green-500 text-sm font-medium flex items-center gap-1">⬇️ 10.1% vs last month</p>
          </div>

          <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Biggest Expense</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white truncate">Groceries</p>
            <p className="text-sm text-gray-500 dark:text-gray-300">$128.50</p>
          </div>

          <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Avg. Daily Spend</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">$15.02</p>
            <p className="text-green-500 text-sm font-medium flex items-center gap-1">⬇️ 1.5% vs last month</p>
          </div>
        </div>

        {/* Charts & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-4 rounded-lg p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">Spending Over Time</p>
            <div className="flex min-h-[260px] items-end">
              {/* Simple SVG area chart placeholder */}
              <svg className="w-full h-56" viewBox="0 0 472 150" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="chart-gradient" x1="236" x2="236" y1="1" y2="149" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4A90E2" stopOpacity="0.3" />
                    <stop offset="1" stopColor="#4A90E2" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H0V109Z" fill="url(#chart-gradient)" />
                <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25" stroke="#4A90E2" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex justify-around pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-300">Week 1</p>
              <p className="text-xs text-gray-500 dark:text-gray-300">Week 2</p>
              <p className="text-xs text-gray-500 dark:text-gray-300">Week 3</p>
              <p className="text-xs text-gray-500 dark:text-gray-300">Week 4</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-lg p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI-Powered Insights</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-yellow-100 rounded-full mt-1">🔥</div>
                <p className="text-sm text-gray-600 dark:text-gray-300">You're spending <strong>20% more</strong> on 'Eating Out' this month compared to your average.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-full mt-1">✅</div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Great job! You're on track to meet your <strong>monthly savings goal</strong>.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-full mt-1">💡</div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Consider reducing your <strong>4 subscriptions</strong> to save about $45/month.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions table (summary) */}
        <div className="rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
            <div className="relative w-64">
              <input className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-primary focus:border-primary" placeholder="Search transactions..." />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Merchant</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Oct 26, 2023</td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">Campus Cafe</td>
                  <td className="px-6 py-4"><span className="bg-blue-100 text-blue-600 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">Food</span></td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">-$8.50</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Oct 25, 2023</td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">City Metro Transit</td>
                  <td className="px-6 py-4"><span className="bg-purple-100 text-purple-600 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">Transport</span></td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">-$2.75</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">Oct 24, 2023</td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">University Bookstore</td>
                  <td className="px-6 py-4"><span className="bg-orange-100 text-orange-600 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">Education</span></td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">-$54.99</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
