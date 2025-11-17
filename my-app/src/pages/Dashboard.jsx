import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate();
  const transactions = [
    { id: 1, name: 'Campus Cafeteria', category: 'Food', amount: -8.50, icon: '🍴' },
    { id: 2, name: 'Cinema Plex', category: 'Entertainment', amount: -15.00, icon: '🎭' },
    { id: 3, name: 'Metro Pass', category: 'Transport', amount: -2.75, icon: '🚇' },
    { id: 4, name: 'Bookstore', category: 'Supplies', amount: -42.30, icon: '🛍️' },
  ];

  return (
    <div className="p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Page Heading */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div className="flex flex-col gap-1">
            <p className="text-[#111827] dark:text-white text-4xl font-black">Hello, Alex!</p>
            <p className="text-[#6b7280] dark:text-[#92b2c9] text-base">Here's your financial overview for this month.</p>
          </div>
          <button onClick={() => navigate('/add-expense')} className="flex items-center justify-center rounded-lg h-10 px-4 bg-blue-500 text-white text-sm font-bold hover:bg-blue-600 transition-colors">
            <span className="mr-2">➕</span>
            <span>Add Expense</span>
          </button>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Monthly Budget Card */}
            <div className="bg-[#fdfdff] dark:bg-[#111b22] rounded-xl p-6 shadow-sm">
              <div className="flex gap-6 justify-between items-center">
                <p className="text-[#111827] dark:text-white text-lg font-bold">Monthly Budget</p>
                <p className="text-[#111827] dark:text-white text-lg font-bold">$1300 / $2000</p>
              </div>
              <div className="mt-4">
                <div className="w-full bg-[#e5e7eb] dark:bg-[#325167] rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <p className="text-[#6b7280] dark:text-[#92b2c9] text-sm mt-2">$700 remaining</p>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Spending Breakdown Card */}
              <div className="bg-[#fdfdff] dark:bg-[#111b22] rounded-xl p-6 shadow-sm">
                <div className="flex flex-col gap-4 h-full">
                  <div>
                    <p className="text-[#111827] dark:text-white text-base font-medium">Spending Breakdown</p>
                    <p className="text-[#111827] dark:text-white text-3xl font-bold">$1,300</p>
                    <div className="flex gap-1 mt-2">
                      <p className="text-[#6b7280] dark:text-[#92b2c9] text-sm">This Month</p>
                      <p className="text-green-500 text-sm font-medium">⬆️ 5%</p>
                    </div>
                  </div>
                  <div className="flex-grow flex items-center justify-center">
                    <svg className="w-40 h-40" viewBox="0 0 36 36">
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#4ade80" strokeDasharray="40, 100" strokeWidth="3"></path>
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#facc15" strokeDasharray="25, 100" strokeDashoffset="-40" strokeWidth="3"></path>
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#60a5fa" strokeDasharray="15, 100" strokeDashoffset="-65" strokeWidth="3"></path>
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#c084fc" strokeDasharray="20, 100" strokeDashoffset="-80" strokeWidth="3"></path>
                    </svg>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#4ade80]"></span>
                      <p className="text-[#4b5563] dark:text-[#92b2c9]">Food</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#facc15]"></span>
                      <p className="text-[#4b5563] dark:text-[#92b2c9]">Transport</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#60a5fa]"></span>
                      <p className="text-[#4b5563] dark:text-[#92b2c9]">Rent</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#c084fc]"></span>
                      <p className="text-[#4b5563] dark:text-[#92b2c9]">Entertainment</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Spending Trend Card */}
              <div className="bg-[#fdfdff] dark:bg-[#111b22] rounded-xl p-6 shadow-sm">
                <div className="flex flex-col h-full">
                  <div>
                    <p className="text-[#111827] dark:text-white text-base font-medium">Spending Over Time</p>
                    <p className="text-[#111827] dark:text-white text-3xl font-bold">$450</p>
                    <div className="flex gap-1 mt-2">
                      <p className="text-[#6b7280] dark:text-[#92b2c9] text-sm">Last 30 Days</p>
                      <p className="text-orange-500 text-sm font-medium">⬇️ 10%</p>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-end gap-2 py-4 mt-4">
                    <svg fill="none" height="100%" preserveAspectRatio="none" viewBox="-3 0 478 150" width="100%" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H326.769H0V109Z" fill="url(#paint0_linear_1131_5935)"></path>
                      <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25" stroke="#1392ec" strokeLinecap="round" strokeWidth="3"></path>
                      <defs>
                        <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1131_5935" x1="236" x2="236" y1="1" y2="149">
                          <stop stopColor="#1392ec" stopOpacity="0.4"></stop>
                          <stop offset="1" stopColor="#1392ec" stopOpacity="0"></stop>
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="flex justify-around">
                      <p className="text-[#6b7280] dark:text-[#92b2c9] text-xs font-bold">Week 1</p>
                      <p className="text-[#6b7280] dark:text-[#92b2c9] text-xs font-bold">Week 2</p>
                      <p className="text-[#6b7280] dark:text-[#92b2c9] text-xs font-bold">Week 3</p>
                      <p className="text-[#6b7280] dark:text-[#92b2c9] text-xs font-bold">Week 4</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Smart Suggestions Card */}
            <div className="bg-[#fdfdff] dark:bg-[#111b22] rounded-xl p-6 shadow-sm">
              <h2 className="text-[#111827] dark:text-white text-lg font-bold mb-4">Smart Suggestions</h2>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-blue-500/20 rounded-lg">
                  <span className="text-2xl">💡</span>
                  <div>
                    <p className="font-semibold text-sm text-[#111827] dark:text-white">Cut back on coffee</p>
                    <p className="text-[#6b7280] dark:text-[#92b2c9] text-sm">You've spent 20% more on coffee this week. Try making it at home!</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-blue-500/20 rounded-lg">
                  <span className="text-2xl">🎉</span>
                  <div>
                    <p className="font-semibold text-sm text-[#111827] dark:text-white">Great job on transport!</p>
                    <p className="text-[#6b7280] dark:text-[#92b2c9] text-sm">Your transportation costs are 15% lower than last month.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-blue-500/20 rounded-lg">
                  <span className="text-2xl">💰</span>
                  <div>
                    <p className="font-semibold text-sm text-[#111827] dark:text-white">Savings opportunity</p>
                    <p className="text-[#6b7280] dark:text-[#92b2c9] text-sm">Consider reviewing your streaming subscriptions to save more.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Card */}
            <div className="bg-[#fdfdff] dark:bg-[#111b22] rounded-xl p-6 shadow-sm">
              <h2 className="text-[#111827] dark:text-white text-lg font-bold mb-4">Recent Activity</h2>
              <div className="flex flex-col gap-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                        <span className="text-lg">{transaction.icon}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-[#111827] dark:text-white">{transaction.name}</p>
                        <p className="text-xs text-[#6b7280] dark:text-[#92b2c9]">{transaction.category}</p>
                      </div>
                    </div>
                    <p className="font-bold text-sm text-[#111827] dark:text-white">${Math.abs(transaction.amount).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
