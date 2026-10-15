import React, { useState, useEffect, useMemo } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, AreaChart, Area
} from 'recharts';
import {
  Wallet, TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon,
  CreditCard, Target, Calculator, Plus, Search, Filter, Download, Upload,
  Trash2, Edit, CheckCircle, AlertTriangle, ArrowUpRight, ArrowDownRight,
  Sun, Moon, ShieldAlert, Sparkles, ChevronRight, Layers, Award, RefreshCw,
  MoreVertical, Check, X, Calendar, Tag, Briefcase, PiggyBank, BarChart3, Clock
} from 'lucide-react';

// --- INITIAL MOCK DATA ---
const INITIAL_TRANSACTIONS = [
  { id: 'tx-1', date: '2026-10-14', description: 'Tech Corp Salary', amount: 4800, type: 'income', category: 'Salary', tags: ['work', 'main'] },
  { id: 'tx-2', date: '2026-10-12', description: 'Luxury Apartment Rent', amount: 1850, type: 'expense', category: 'Housing', tags: ['fixed', 'essential'] },
  { id: 'tx-3', date: '2026-10-10', description: 'Whole Foods Market', amount: 245.50, type: 'expense', category: 'Food', tags: ['groceries'] },
  { id: 'tx-4', date: '2026-10-08', description: 'Freelance Design Client', amount: 1200, type: 'income', category: 'Freelance', tags: ['side-hustle'] },
  { id: 'tx-5', date: '2026-10-05', description: 'Electric & Power Bill', amount: 135.20, type: 'expense', category: 'Utilities', tags: ['bills'] },
  { id: 'tx-6', date: '2026-10-04', description: 'Netflix & Spotify Subs', amount: 34.99, type: 'expense', category: 'Entertainment', tags: ['subscriptions'] },
  { id: 'tx-7', date: '2026-10-02', description: 'Equinox Gym Membership', amount: 180, type: 'expense', category: 'Health', tags: ['fitness'] },
  { id: 'tx-8', date: '2026-09-28', description: 'Uber Rides', amount: 62.40, type: 'expense', category: 'Transportation', tags: ['commute'] },
  { id: 'tx-9', date: '2026-09-25', description: 'Stock Dividend Payment', amount: 145.80, type: 'income', category: 'Investment', tags: ['passive'] },
  { id: 'tx-10', date: '2026-09-20', description: 'Dining Out - Steakhouse', amount: 185.00, type: 'expense', category: 'Food', tags: ['leisure'] }
];

const INITIAL_BUDGETS = [
  { id: 'b-1', category: 'Housing', target: 2000, spent: 1850, color: '#3B82F6' },
  { id: 'b-2', category: 'Food', target: 600, spent: 580, color: '#10B981' },
  { id: 'b-3', category: 'Entertainment', target: 300, spent: 340, color: '#EF4444' }, // over budget
  { id: 'b-4', category: 'Utilities', target: 200, spent: 135.20, color: '#F59E0B' },
  { id: 'b-5', category: 'Transportation', target: 250, spent: 120, color: '#8B5CF6' },
  { id: 'b-6', category: 'Health', target: 200, spent: 180, color: '#EC4899' }
];

const INITIAL_GOALS = [
  { id: 'g-1', title: 'Emergency Fund', current: 12500, target: 15000, targetDate: '2026-12-31', category: 'Safety', color: 'from-blue-500 to-indigo-600' },
  { id: 'g-2', title: 'Japan Trip 2027', current: 3200, target: 5000, targetDate: '2027-04-15', category: 'Travel', color: 'from-emerald-400 to-teal-600' },
  { id: 'g-3', title: 'Tesla Model 3 Down Payment', current: 8000, target: 10000, targetDate: '2027-08-01', category: 'Auto', color: 'from-amber-400 to-orange-600' },
  { id: 'g-4', title: 'Home Renovation', current: 4500, target: 20000, targetDate: '2028-01-01', category: 'Property', color: 'from-purple-500 to-pink-600' }
];

const INITIAL_ASSETS = [
  { id: 'a-1', name: 'Vanguard Total Stock Market (VTI)', category: 'Stocks', amount: 38500, change: '+12.4%', color: '#3B82F6' },
  { id: 'a-2', name: 'High Yield Savings Account', category: 'Cash', amount: 18200, change: '+4.5%', color: '#10B981' },
  { id: 'a-3', name: 'Bitcoin & Ethereum', category: 'Crypto', amount: 8400, change: '-3.2%', color: '#F59E0B' },
  { id: 'a-4', name: 'REIT Real Estate Fund', category: 'Real Estate', amount: 14200, change: '+8.1%', color: '#8B5CF6' }
];

const CASH_FLOW_DATA = [
  { month: 'May', income: 5400, expense: 3100 },
  { month: 'Jun', income: 5800, expense: 3300 },
  { month: 'Jul', income: 5200, expense: 2900 },
  { month: 'Aug', income: 6100, expense: 3800 },
  { month: 'Sep', income: 5900, expense: 3200 },
  { month: 'Oct', income: 6145, expense: 3027 }
];

const NET_WORTH_HISTORY = [
  { month: 'May', netWorth: 68500 },
  { month: 'Jun', netWorth: 71000 },
  { month: 'Jul', netWorth: 73300 },
  { month: 'Aug', netWorth: 75600 },
  { month: 'Sep', netWorth: 77800 },
  { month: 'Oct', netWorth: 79300 }
];

export default function App() {
  // Theme State
  const [darkMode, setDarkMode] = useState(true);

  // Active Navigation
  const [activeTab, setActiveTab] = useState('overview');

  // Core Financial Data State with Local Storage fallback
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('pf_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('pf_budgets');
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('pf_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [assets, setAssets] = useState(() => {
    const saved = localStorage.getItem('pf_assets');
    return saved ? JSON.parse(saved) : INITIAL_ASSETS;
  });

  // Modal Control States
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [goalModalType, setGoalModalType] = useState('add'); // 'add' or 'deposit'
  const [selectedGoal, setSelectedGoal] = useState(null);

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('pf_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('pf_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('pf_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('pf_assets', JSON.stringify(assets));
  }, [assets]);

  // Calculations for summary statistics
  const totalIncome = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }, [transactions]);

  const totalSavings = useMemo(() => {
    return goals.reduce((sum, g) => sum + Number(g.current), 0);
  }, [goals]);

  const totalInvestments = useMemo(() => {
    return assets.reduce((sum, a) => sum + Number(a.amount), 0);
  }, [assets]);

  const netWorth = useMemo(() => {
    return totalInvestments + totalSavings;
  }, [totalInvestments, totalSavings]);

  // Compute Financial Health Score dynamically (0 - 100)
  const healthScore = useMemo(() => {
    let score = 50;
    // Savings ratio check
    const savingsRatio = totalIncome > 0 ? (totalIncome - totalExpenses) / totalIncome : 0;
    if (savingsRatio >= 0.3) score += 20;
    else if (savingsRatio >= 0.15) score += 10;

    // Emergency fund score
    const monthlyBurn = totalExpenses || 2500;
    const emergencyGoal = goals.find(g => g.title.toLowerCase().includes('emergency'));
    if (emergencyGoal && emergencyGoal.current >= monthlyBurn * 3) score += 20;
    else if (emergencyGoal && emergencyGoal.current >= monthlyBurn) score += 10;

    // Budget compliance check
    const overBudgets = budgets.filter(b => b.spent > b.target);
    if (overBudgets.length === 0) score += 10;
    else score -= (overBudgets.length * 5);

    return Math.min(Math.max(score, 20), 98);
  }, [totalIncome, totalExpenses, goals, budgets]);

  // Reset to original dummy data
  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset all data to default mock settings?")) {
      setTransactions(INITIAL_TRANSACTIONS);
      setBudgets(INITIAL_BUDGETS);
      setGoals(INITIAL_GOALS);
      setAssets(INITIAL_ASSETS);
      localStorage.clear();
    }
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
      }`}>
      {/* SIDEBAR NAVIGATION */}
      <aside className={`w-full md:w-64 flex-shrink-0 border-r border-b md:border-b-0 p-4 flex md:flex-col justify-between ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
        <div>
          {/* Logo Brand */}
          <div className="flex items-center gap-3 px-2 py-3 mb-6">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 text-white shadow-lg shadow-indigo-500/20">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                Jeffrey's Finance
              </h1>
              <p className="text-xs text-slate-500 font-medium">Wealth Dashboard</p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5 flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
            <NavItem
              id="overview" icon={<BarChart3 className="w-5 h-5" />} label="Overview"
              active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} darkMode={darkMode}
            />
            <NavItem
              id="transactions" icon={<CreditCard className="w-5 h-5" />} label="Transactions"
              active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} darkMode={darkMode}
            />
            <NavItem
              id="budgeting" icon={<PieChartIcon className="w-5 h-5" />} label="Budgets"
              active={activeTab === 'budgeting'} onClick={() => setActiveTab('budgeting')} darkMode={darkMode}
            />
            <NavItem
              id="goals" icon={<Target className="w-5 h-5" />} label="Savings & Goals"
              active={activeTab === 'goals'} onClick={() => setActiveTab('goals')} darkMode={darkMode}
            />
            <NavItem
              id="portfolio" icon={<Layers className="w-5 h-5" />} label="Portfolio"
              active={activeTab === 'portfolio'} onClick={() => setActiveTab('portfolio')} darkMode={darkMode}
            />
            <NavItem
              id="calculators" icon={<Calculator className="w-5 h-5" />} label="Calculators"
              active={activeTab === 'calculators'} onClick={() => setActiveTab('calculators')} darkMode={darkMode}
            />
          </nav>
        </div>

        {/* Bottom Control Actions */}
        <div className="hidden md:flex flex-col gap-2 pt-4 border-t border-slate-800/50">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-full flex items-center justify-between p-2.5 rounded-lg text-sm font-medium transition-all ${darkMode ? 'bg-slate-800/60 hover:bg-slate-800 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
          >
            <span className="flex items-center gap-2">
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>

          <button
            onClick={handleResetData}
            className="w-full flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Demo Data
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* TOP HEADER BAR */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/40">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {activeTab === 'overview' && 'Financial Dashboard'}
              {activeTab === 'transactions' && 'Transactions Ledger'}
              {activeTab === 'budgeting' && 'Budget Planner'}
              {activeTab === 'goals' && 'Savings Goals'}
              {activeTab === 'portfolio' && 'Asset Portfolio'}
              {activeTab === 'calculators' && 'Financial Calculators'}
            </h2>
            <p className="text-sm text-slate-400">Welcome back, here is your financial health status today.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingTx(null);
                setIsTxModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/30"
            >
              <Plus className="w-4 h-4" />
              Add Transaction
            </button>

            {/* Mobile dark mode toggle button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>
          </div>
        </header>

        {/* VIEW 1: OVERVIEW DASHBOARD */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <SummaryCard
                title="Total Net Worth"
                amount={`$${netWorth.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                trend="+3.8% from last mo"
                isPositive={true}
                icon={<Wallet className="w-5 h-5 text-emerald-400" />}
                darkMode={darkMode}
              />
              <SummaryCard
                title="Monthly Income"
                amount={`$${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                trend="+12% from last mo"
                isPositive={true}
                icon={<TrendingUp className="w-5 h-5 text-indigo-400" />}
                darkMode={darkMode}
              />
              <SummaryCard
                title="Monthly Expenses"
                amount={`$${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                trend="-4.2% from last mo"
                isPositive={true}
                icon={<TrendingDown className="w-5 h-5 text-rose-400" />}
                darkMode={darkMode}
              />
              <SummaryCard
                title="Total Savings Pool"
                amount={`$${totalSavings.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                trend="Target: $50,000"
                isPositive={true}
                icon={<PiggyBank className="w-5 h-5 text-amber-400" />}
                darkMode={darkMode}
              />
            </div>

            {/* CHARTS GRID SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cashflow Bar Chart */}
              <div className={`lg:col-span-2 p-5 rounded-2xl border ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">Cash Flow Analysis</h3>
                    <p className="text-xs text-slate-400">Monthly breakdown of income vs expenses</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-medium border border-indigo-500/20">
                    Last 6 Months
                  </span>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={CASH_FLOW_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="month" stroke={darkMode ? '#64748b' : '#94a3b8'} fontSize={12} tickLine={false} />
                      <YAxis stroke={darkMode ? '#64748b' : '#94a3b8'} fontSize={12} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                          borderColor: darkMode ? '#334155' : '#e2e8f0',
                          borderRadius: '12px',
                          color: darkMode ? '#f8fafc' : '#0f172a'
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Bar dataKey="income" name="Income" fill="#10B981" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Financial Health Indicator Gauge */}
              <div className={`p-5 rounded-2xl border flex flex-col justify-between ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">Financial Health</h3>
                    <Sparkles className="w-5 h-5 text-amber-400" />
                  </div>
                  <p className="text-xs text-slate-400 mb-6">Score calculated based on savings rate & debt</p>

                  {/* Gauge Display */}
                  <div className="flex flex-col items-center justify-center my-2">
                    <div className="relative w-36 h-36 flex items-center justify-center rounded-full border-8 border-slate-800 bg-slate-900/40">
                      <div className="text-center">
                        <span className="text-4xl font-extrabold tracking-tight text-indigo-400">{healthScore}</span>
                        <span className="text-xs block text-slate-400 font-medium">/ 100</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations Smart Insights */}
                <div className="space-y-2 mt-4 pt-4 border-t border-slate-800/60">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">AI Insights & Tips</span>
                  <div className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/50">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Entertainment spending is 13% above target this month.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/50">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Emergency fund is on track to hit target in 2 months.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECONDARY ROW: Expense Pie Chart & Recent Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Expense Breakdown Pie Chart */}
              <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <h3 className="font-semibold text-lg mb-1">Expense Breakdown</h3>
                <p className="text-xs text-slate-400 mb-4">Spending by main category</p>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={budgets}
                        dataKey="spent"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={4}
                      >
                        {budgets.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                          borderColor: darkMode ? '#334155' : '#e2e8f0',
                          borderRadius: '12px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  {budgets.map((b) => (
                    <div key={b.id} className="flex items-center gap-2 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.color }} />
                      <span className="text-slate-400 truncate">{b.category}</span>
                      <span className="font-semibold ml-auto">${b.spent}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Transactions Quick Feed */}
              <div className={`lg:col-span-2 p-5 rounded-2xl border flex flex-col justify-between ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">Recent Activity</h3>
                      <p className="text-xs text-slate-400">Latest transactions across accounts</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('transactions')}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      View All <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {transactions.slice(0, 5).map((tx) => (
                      <div
                        key={tx.id}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${darkMode ? 'bg-slate-800/30 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-100'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${tx.type === 'income'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}>
                            {tx.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{tx.description}</p>
                            <span className="text-xs text-slate-500">{tx.category} • {tx.date}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className={`font-semibold text-sm ${tx.type === 'income' ? 'text-emerald-400' : 'text-slate-200'}`}>
                            {tx.type === 'income' ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: TRANSACTIONS MANAGER */}
        {activeTab === 'transactions' && (
          <TransactionsView
            transactions={transactions}
            setTransactions={setTransactions}
            darkMode={darkMode}
            onOpenModal={() => {
              setEditingTx(null);
              setIsTxModalOpen(true);
            }}
            onEditTx={(tx) => {
              setEditingTx(tx);
              setIsTxModalOpen(true);
            }}
          />
        )}

        {/* VIEW 3: BUDGETING & SPENDING PLANNER */}
        {activeTab === 'budgeting' && (
          <BudgetingView
            budgets={budgets}
            setBudgets={setBudgets}
            darkMode={darkMode}
            onOpenAddBudget={() => setIsBudgetModalOpen(true)}
          />
        )}

        {/* VIEW 4: SAVINGS & GOALS TRACKER */}
        {activeTab === 'goals' && (
          <GoalsView
            goals={goals}
            setGoals={setGoals}
            darkMode={darkMode}
            onOpenDepositModal={(goal) => {
              setSelectedGoal(goal);
              setGoalModalType('deposit');
              setIsGoalModalOpen(true);
            }}
            onOpenAddGoalModal={() => {
              setSelectedGoal(null);
              setGoalModalType('add');
              setIsGoalModalOpen(true);
            }}
          />
        )}

        {/* VIEW 5: INVESTMENT / ASSET PORTFOLIO */}
        {activeTab === 'portfolio' && (
          <PortfolioView assets={assets} setAssets={setAssets} darkMode={darkMode} />
        )}

        {/* VIEW 6: CALCULATORS */}
        {activeTab === 'calculators' && (
          <CalculatorsView darkMode={darkMode} totalExpenses={totalExpenses} />
        )}
      </main>

      {/* MODAL: Add/Edit Transaction */}
      {isTxModalOpen && (
        <TransactionModal
          isOpen={isTxModalOpen}
          onClose={() => setIsTxModalOpen(false)}
          darkMode={darkMode}
          editingTx={editingTx}
          onSave={(txData) => {
            if (editingTx) {
              setTransactions(transactions.map(t => t.id === editingTx.id ? { ...txData, id: editingTx.id } : t));
            } else {
              setTransactions([{ ...txData, id: `tx-${Date.now()}` }, ...transactions]);
            }
            setIsTxModalOpen(false);
          }}
        />
      )}

      {/* MODAL: Goals Action */}
      {isGoalModalOpen && (
        <GoalModal
          isOpen={isGoalModalOpen}
          onClose={() => setIsGoalModalOpen(false)}
          darkMode={darkMode}
          type={goalModalType}
          goal={selectedGoal}
          onSaveGoal={(goalData) => {
            setGoals([...goals, { ...goalData, id: `g-${Date.now()}` }]);
            setIsGoalModalOpen(false);
          }}
          onDeposit={(goalId, amount) => {
            setGoals(goals.map(g => g.id === goalId ? { ...g, current: Number(g.current) + Number(amount) } : g));
            setIsGoalModalOpen(false);
          }}
        />
      )}

      {/* MODAL: New Category Budget Target */}
      {isBudgetModalOpen && (
        <AddBudgetModal
          isOpen={isBudgetModalOpen}
          onClose={() => setIsBudgetModalOpen(false)}
          darkMode={darkMode}
          onSave={(budgetData) => {
            setBudgets([...budgets, { ...budgetData, id: `b-${Date.now()}` }]);
            setIsBudgetModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

// --- SUB-COMPONENTS & VIEWS ---

function NavItem({ id, icon, label, active, onClick, darkMode }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${active
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-semibold'
          : darkMode
            ? 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function SummaryCard({ title, amount, trend, isPositive, icon, darkMode }) {
  return (
    <div className={`p-5 rounded-2xl border transition-all ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className="p-2 rounded-xl bg-slate-800/40 border border-slate-700/50">{icon}</div>
      </div>
      <div className="text-2xl font-bold tracking-tight mb-1">{amount}</div>
      <div className="flex items-center gap-1.5 text-xs font-medium">
        <span className={isPositive ? 'text-emerald-400' : 'text-rose-400'}>{trend}</span>
      </div>
    </div>
  );
}

// --- VIEW COMPONENTS ---

// 1. TRANSACTIONS VIEW
function TransactionsView({ transactions, setTransactions, darkMode, onOpenModal, onEditTx }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const categories = ['All', ...new Set(transactions.map(t => t.category))];

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCat = categoryFilter === 'All' || t.category === categoryFilter;
      const matchesType = typeFilter === 'All' || t.type === typeFilter;
      return matchesSearch && matchesCat && matchesType;
    });
  }, [transactions, searchTerm, categoryFilter, typeFilter]);

  const handleDelete = (id) => {
    if (confirm('Delete this transaction?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const exportToCSV = () => {
    const headers = ['Date,Description,Category,Type,Amount,Tags\n'];
    const rows = transactions.map(t =>
      `"${t.date}","${t.description}","${t.category}","${t.type}",${t.amount},"${t.tags.join(';')}"`
    );
    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Controls Header */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row gap-4 justify-between items-center ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
        <div className="flex flex-1 flex-col sm:flex-row gap-3 w-full">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search description or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-slate-800/80 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
            />
          </div>

          {/* Filters */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={`px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className={`px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
          >
            <option value="All">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <button
          onClick={exportToCSV}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className={`text-xs uppercase tracking-wider font-semibold border-b ${darkMode ? 'bg-slate-800/40 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}>
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Description</th>
                <th className="p-4">Category</th>
                <th className="p-4">Tags</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">
                    No transactions match your search query.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className={darkMode ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}>
                    <td className="p-4 whitespace-nowrap text-xs text-slate-400">{tx.date}</td>
                    <td className="p-4 font-medium">{tx.description}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300">
                        {tx.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {tx.tags?.map(t => (
                          <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className={`p-4 text-right font-semibold whitespace-nowrap ${tx.type === 'income' ? 'text-emerald-400' : 'text-slate-100'
                      }`}>
                      {tx.type === 'income' ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onEditTx(tx)}
                          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(tx.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// 2. BUDGETING VIEW
function BudgetingView({ budgets, setBudgets, darkMode, onOpenAddBudget }) {
  const totalBudgeted = budgets.reduce((acc, b) => acc + Number(b.target), 0);
  const totalSpent = budgets.reduce((acc, b) => acc + Number(b.spent), 0);
  const totalRemaining = totalBudgeted - totalSpent;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          <span className="text-xs font-semibold text-slate-400 uppercase">Total Budget Cap</span>
          <p className="text-2xl font-bold mt-1">${totalBudgeted.toLocaleString()}</p>
        </div>
        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          <span className="text-xs font-semibold text-slate-400 uppercase">Total Spent</span>
          <p className="text-2xl font-bold mt-1 text-indigo-400">${totalSpent.toLocaleString()}</p>
        </div>
        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          <span className="text-xs font-semibold text-slate-400 uppercase">Remaining Pool</span>
          <p className={`text-2xl font-bold mt-1 ${totalRemaining < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            ${totalRemaining.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Category Progress Cards Grid */}
      <div className="flex items-center justify-between pt-2">
        <h3 className="font-bold text-lg">Category Allocations</h3>
        <button
          onClick={onOpenAddBudget}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
        >
          <Plus className="w-4 h-4" /> New Category Target
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map((b) => {
          const percent = Math.min(Math.round((b.spent / b.target) * 100), 100);
          const isOver = b.spent > b.target;

          return (
            <div key={b.id} className={`p-5 rounded-2xl border space-y-3 ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
              }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: b.color }} />
                  <span className="font-semibold text-base">{b.category}</span>
                </div>
                {isOver && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                    <AlertTriangle className="w-3 h-3" /> Over Target
                  </span>
                )}
              </div>

              <div className="flex items-baseline justify-between text-xs text-slate-400">
                <span>Spent: <strong className="text-slate-100">${b.spent}</strong></span>
                <span>Target: <strong>${b.target}</strong></span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all duration-500 ${isOver ? 'bg-rose-500' : 'bg-indigo-500'}`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-xs text-slate-400 pt-1">
                <span>{percent}% allocated used</span>
                <span>{b.target - b.spent > 0 ? `$${b.target - b.spent} remaining` : `$${Math.abs(b.target - b.spent)} over limit`}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 3. SAVINGS GOALS VIEW
function GoalsView({ goals, setGoals, darkMode, onOpenDepositModal, onOpenAddGoalModal }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg">Financial Milestones</h3>
          <p className="text-xs text-slate-400">Track progress toward short and long-term targets</p>
        </div>
        <button
          onClick={onOpenAddGoalModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30"
        >
          <Plus className="w-4 h-4" /> Create New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const progress = Math.min(Math.round((goal.current / goal.target) * 100), 100);

          return (
            <div key={goal.id} className={`p-6 rounded-2xl border flex flex-col justify-between relative overflow-hidden ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
              }`}>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      {goal.category}
                    </span>
                    <h4 className="font-bold text-lg mt-2">{goal.title}</h4>
                  </div>
                  <span className="text-2xl font-black text-indigo-400">{progress}%</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-400 font-medium">
                    <span>Saved: ${goal.current.toLocaleString()}</span>
                    <span>Target: ${goal.target.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full bg-gradient-to-r ${goal.color || 'from-indigo-500 to-emerald-400'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800/60">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" /> Target Date: {goal.targetDate}
                </div>

                <button
                  onClick={() => onOpenDepositModal(goal)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-indigo-300 border border-slate-700 transition-all"
                >
                  Deposit Funds
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 4. PORTFOLIO VIEW
function PortfolioView({ assets, setAssets, darkMode }) {
  const totalValue = assets.reduce((sum, a) => sum + Number(a.amount), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Holdings Breakdown */}
        <div className={`p-6 rounded-2xl border flex flex-col justify-between ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
          }`}>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Total Asset Valuation</span>
            <h3 className="text-3xl font-extrabold mt-1">${totalValue.toLocaleString()}</h3>
            <p className="text-xs text-emerald-400 font-medium mt-1">+6.4% Overall Unaligned Yield</p>
          </div>

          <div className="mt-6 space-y-3">
            {assets.map((asset) => {
              const allocationPct = Math.round((asset.amount / totalValue) * 100);
              return (
                <div key={asset.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{asset.category}</span>
                    <span className="text-slate-400">{allocationPct}% (${asset.amount.toLocaleString()})</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="h-1.5 rounded-full" style={{ width: `${allocationPct}%`, backgroundColor: asset.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Asset List Cards */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-lg">Holdings Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {assets.map((asset) => (
              <div key={asset.id} className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400">{asset.category}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${asset.change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                    {asset.change}
                  </span>
                </div>
                <h4 className="font-bold text-base mb-1">{asset.name}</h4>
                <p className="text-xl font-extrabold text-indigo-400">${asset.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 5. CALCULATORS VIEW
function CalculatorsView({ darkMode, totalExpenses }) {
  // Compound Calculator State
  const [initial, setInitial] = useState(5000);
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(10);

  // Calculate Projection
  const calcData = useMemo(() => {
    let current = Number(initial);
    let totalDeposits = Number(initial);
    const result = [];

    for (let yr = 1; yr <= years; yr++) {
      for (let m = 0; m < 12; m++) {
        current += Number(monthly);
        current *= (1 + (rate / 100) / 12);
        totalDeposits += Number(monthly);
      }
      result.push({
        year: `Year ${yr}`,
        balance: Math.round(current),
        contributions: Math.round(totalDeposits)
      });
    }
    return result;
  }, [initial, monthly, rate, years]);

  const finalBalance = calcData.length > 0 ? calcData[calcData.length - 1].balance : 0;

  // Emergency Fund Estimator
  const [monthsCount, setMonthsCount] = useState(6);
  const requiredEmergencyFund = (totalExpenses || 2500) * monthsCount;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Compound Interest Calculator */}
      <div className={`p-6 rounded-2xl border space-y-6 ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
        }`}>
        <div>
          <h3 className="font-bold text-lg">Compound Growth Simulator</h3>
          <p className="text-xs text-slate-400">Project wealth over time with interest compounding</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Initial Balance ($)</label>
            <input
              type="number" value={initial} onChange={(e) => setInitial(e.target.value)}
              className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'}`}
            />
          </div>
          <div>
            <label className="block text-slate-400 font-medium mb-1">Monthly Deposit ($)</label>
            <input
              type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)}
              className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'}`}
            />
          </div>
          <div>
            <label className="block text-slate-400 font-medium mb-1">Annual Return Rate (%)</label>
            <input
              type="number" value={rate} onChange={(e) => setRate(e.target.value)}
              className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'}`}
            />
          </div>
          <div>
            <label className="block text-slate-400 font-medium mb-1">Years Horizon</label>
            <input
              type="number" value={years} onChange={(e) => setYears(e.target.value)}
              className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200'}`}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-center">
          <span className="text-xs text-slate-400 block font-medium">Estimated Future Balance</span>
          <span className="text-3xl font-black text-indigo-400">${finalBalance.toLocaleString()}</span>
        </div>

        {/* Growth Line Chart */}
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={calcData}>
              <XAxis dataKey="year" stroke="#64748b" fontSize={10} />
              <YAxis stroke="#64748b" fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '10px' }} />
              <Area type="monotone" dataKey="balance" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Emergency Fund Estimator */}
      <div className={`p-6 rounded-2xl border space-y-6 ${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
        }`}>
        <div>
          <h3 className="font-bold text-lg">Emergency Fund Estimator</h3>
          <p className="text-xs text-slate-400">Calculate buffer needed based on monthly expenses</p>
        </div>

        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 flex justify-between items-center">
            <span className="text-slate-400">Current Monthly Expense Burn:</span>
            <span className="font-bold text-slate-100 text-base">${totalExpenses}</span>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-2">Coverage Months Buffer ({monthsCount} Months)</label>
            <input
              type="range" min="3" max="12" value={monthsCount} onChange={(e) => setMonthsCount(e.target.value)}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>3 Months (Basic)</span>
              <span>6 Months (Recommended)</span>
              <span>12 Months (Conservative)</span>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/30 text-center space-y-1">
            <span className="text-xs text-indigo-300 font-semibold uppercase tracking-wider block">Recommended Safety Cushion</span>
            <span className="text-3xl font-black text-emerald-400">${requiredEmergencyFund.toLocaleString()}</span>
            <p className="text-[11px] text-slate-400 pt-2">
              Having this cushion ensures complete financial peace of mind during unexpected job losses or emergencies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- MODALS ---

function TransactionModal({ isOpen, onClose, darkMode, editingTx, onSave }) {
  const [description, setDescription] = useState(editingTx ? editingTx.description : '');
  const [amount, setAmount] = useState(editingTx ? editingTx.amount : '');
  const [type, setType] = useState(editingTx ? editingTx.type : 'expense');
  const [category, setCategory] = useState(editingTx ? editingTx.category : 'Food');
  const [date, setDate] = useState(editingTx ? editingTx.date : new Date().toISOString().slice(0, 10));
  const [tags, setTags] = useState(editingTx ? editingTx.tags.join(', ') : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount) return;
    onSave({
      description,
      amount: Number(amount),
      type,
      category,
      date,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">{editingTx ? 'Edit Transaction' : 'New Transaction'}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Description</label>
            <input
              type="text" required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., Apple Store"
              className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Amount ($)</label>
              <input
                type="number" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00"
                className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Type</label>
              <select
                value={type} onChange={(e) => setType(e.target.value)}
                className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Category</label>
              <select
                value={category} onChange={(e) => setCategory(e.target.value)}
                className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
              >
                <option value="Housing">Housing</option>
                <option value="Food">Food</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Utilities">Utilities</option>
                <option value="Transportation">Transportation</option>
                <option value="Salary">Salary</option>
                <option value="Freelance">Freelance</option>
                <option value="Investment">Investment</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Date</label>
              <input
                type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Tags (comma separated)</label>
            <input
              type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="tech, gadget, personal"
              className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">Save Entry</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function GoalModal({ isOpen, onClose, darkMode, type, goal, onSaveGoal, onDeposit }) {
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [depositAmount, setDepositAmount] = useState('');

  const handleSubmitGoal = (e) => {
    e.preventDefault();
    if (!title || !target) return;
    onSaveGoal({
      title,
      target: Number(target),
      current: Number(current) || 0,
      targetDate: targetDate || '2027-12-31',
      category: 'General',
      color: 'from-indigo-500 to-emerald-400'
    });
  };

  const handleDepositSubmit = (e) => {
    e.preventDefault();
    if (!depositAmount) return;
    onDeposit(goal.id, depositAmount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">{type === 'add' ? 'New Savings Goal' : `Deposit to ${goal?.title}`}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800"><X className="w-5 h-5" /></button>
        </div>

        {type === 'add' ? (
          <form onSubmit={handleSubmitGoal} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Goal Name</label>
              <input
                type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Vacation Fund"
                className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Target Amount ($)</label>
                <input
                  type="number" required value={target} onChange={(e) => setTarget(e.target.value)} placeholder="5000"
                  className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                />
              </div>
              <div>
                <label className="block text-slate-400 font-medium mb-1">Initial Saved ($)</label>
                <input
                  type="number" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="0"
                  className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Target Completion Date</label>
              <input
                type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)}
                className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
              />
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold">Create Goal</button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleDepositSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Deposit Amount ($)</label>
              <input
                type="number" required value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} placeholder="100.00"
                className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
              />
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold">Confirm Deposit</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function AddBudgetModal({ isOpen, onClose, darkMode, onSave }) {
  const [category, setCategory] = useState('');
  const [target, setTarget] = useState('');
  const [color, setColor] = useState('#3B82F6');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category || !target) return;
    onSave({
      category,
      target: Number(target),
      spent: 0,
      color
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Add Custom Budget Category</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Category Name</label>
            <input
              type="text" required value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., Subscriptions"
              className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
            />
          </div>
          <div>
            <label className="block text-slate-400 font-medium mb-1">Monthly Target Cap ($)</label>
            <input
              type="number" required value={target} onChange={(e) => setTarget(e.target.value)} placeholder="500"
              className={`w-full p-2.5 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
            />
          </div>
          <div>
            <label className="block text-slate-400 font-medium mb-1">Color Indicator</label>
            <input
              type="color" value={color} onChange={(e) => setColor(e.target.value)}
              className="w-full h-10 rounded-xl cursor-pointer bg-transparent border-0"
            />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold">Save Category</button>
          </div>
        </form>
      </div>
    </div>
  );
}