// src/pages/dashboard/DashboardHome.tsx
import { useMemo, useState } from 'react';
import { Calendar, DocumentDownload, ArrowUp, ArrowDown} from 'iconsax-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
 BarChart, Bar
} from 'recharts';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { useAdminStats, useFinancialSummary, usePlatformStats, useRegistrationTrends, type PlatformStats } from '@/components/hooks/useAdminStats';
import { ChurnChart } from '../Subscriptions/components/ChurnChart';

const getDateRange = (filter: string) => {
  const end = new Date();
  const start = new Date();

  if (filter === '24 hours') {
    start.setDate(end.getDate() - 1);
  } else if (filter === '7 days') {
    start.setDate(end.getDate() - 7);
  } else if (filter === '30 days') {
    start.setDate(end.getDate() - 30);
  } else if (filter === '12 months') {
    start.setMonth(end.getMonth() - 12);
  }

  // Format as YYYY-MM-DD
  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0]
  };
};

export const DashboardHome = () => {
  const [activeTimeFilter, setActiveTimeFilter] = useState('12 months');
  const apiPeriodMap: Record<string, string> = {
    '24 hours': 'day',
    '7 days': 'week',
    '30 days': 'month',
    '12 months': 'month', // Mapping 12 months to 'month' since the API only accepts day/week/month
  };

  const apiPeriod = apiPeriodMap[activeTimeFilter] || 'month';
  const dateParams = useMemo(() => getDateRange(activeTimeFilter), [activeTimeFilter]);

  //  Pass the dateParams to the hooks
  const { data: adminStats, isLoading: isAdminLoading } = useAdminStats(dateParams);
  const { data: platformStats, isLoading: isPlatformLoading } = usePlatformStats(dateParams);
  const { data: financialData, isLoading: isFinancialLoading } = useFinancialSummary(dateParams);
  const { data: registrationData } = useRegistrationTrends(dateParams);

  // 2. Map API data to the Metrics Grid (with safe fallbacks)
  const metrics = [
    { label: 'TOTAL USERS', value: adminStats?.totalUsers?.toLocaleString() || '0', trend: adminStats?.totalUsersGrowth || '+0%', up: true },
    { label: 'SYNCED BANK ACCOUNTS', value: adminStats?.totalSyncedBankAccounts?.toLocaleString() || '0', trend: adminStats?.syncedAccountsGrowth || '+0%', up: true },
    { label: 'ACTIVE', value: platformStats?.activeUsers?.toLocaleString() || '0', trend: platformStats?.activeUsersGrowth || '+0%', up: true },
    { label: 'INACTIVE', value: platformStats?.inactiveUsers?.toLocaleString() || '0', trend: platformStats?.inactiveUsersGrowth || '+0%', up: true },
    { label: 'UNCATEGORIZED TRANSACTIONS', value: adminStats?.uncategorizedTransactions?.toLocaleString() || '0', trend: adminStats?.uncategorizedGrowth || '+0%', up: true },
    { label: 'DELETED', value: platformStats?.deletedUsers?.toLocaleString() || '0', trend: platformStats?.deletedUsersGrowth || '+0%', up: true },
    { label: 'ACTIVE SUBSCRIPTIONS', value: platformStats?.activeSubscriptions?.toLocaleString() || '0', trend: platformStats?.activeSubscriptionsGrowth || '+0%', up: true },
    { label: 'FAILED BANK SYNC', value: platformStats?.failedSyncs?.toLocaleString() || '0', trend: platformStats?.failedSyncsGrowth || '-0%', up: false },
  ];

  //  3. Map API data to Charts
 // Map API data to the MRR Chart
  const mrrData = financialData?.data 
    ? [...financialData.data].reverse().map((item: any) => {
        // Convert "2026-07" into "JUL"
        const [year, month] = item.period.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        const monthName = date.toLocaleString('default', { month: 'short' }).toUpperCase();

        return {
          name: monthName,
          value: Number(item.credits) || 0 // Assuming 'credits' represents revenue
        };
      })
    : [
        { name: 'JAN', value: 0 }, { name: 'FEB', value: 0 }, { name: 'MAR', value: 0 },
        { name: 'APR', value: 0 }, { name: 'MAY', value: 0 }, { name: 'JUN', value: 0 },
      ]; // Fallback

  // Get the most recent month's revenue for the big header number
  const currentRevenue = financialData?.data?.[0]?.credits 
    ? Number(financialData.data[0].credits) 
    : 0;
const stats: PlatformStats = platformStats?.stats || platformStats || {};

// 2. Extract the Global Churn Rate for your top-level metric card
const globalChurnRate = stats.churnRate || 0;

// 3. Extract the array of plans to display individual churn rates
const plans = stats.planSubscriptionStats || [];
 // 👉 1. Make the Global Pie Chart Dynamic (if you keep it)

  // 👉 2. Map real API data to the Subscriptions Breakdown
  const totalActiveSubs = stats.activeSubscriptions || 1; // Prevent division by zero
  const subscriptionBreakdown = plans
    .map((plan: any, index: number) => {
      const colors = ['bg-blue-600', 'bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-slate-400'];
      const percent = ((plan.activeSubscriptions / totalActiveSubs) * 100).toFixed(0);
      return {
        name: plan.planName,
        value: plan.activeSubscriptions.toString(),
        percent: `${percent}%`,
        color: colors[index % colors.length], // Assigns a color sequentially
      };
    })
    .sort((a, b) => Number(b.value) - Number(a.value)); // Sort highest to lowest

  // 👉 Map API data to the Signups Chart
  const signupsData = registrationData?.data
    ? [...registrationData.data].reverse().map((item: any) => {
        let label = item.period; // Fallback to raw string
        const parts = item.period.split('-');
        
        // Format the label based on the active API period
        if (apiPeriod === 'month' && parts.length >= 2) {
          const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1);
          label = date.toLocaleString('default', { month: 'short' });
        } else if (apiPeriod === 'week' && parts.length >= 2) {
          label = `Wk ${parts[1]}`;
        } else if (apiPeriod === 'day' && parts.length === 3) {
          label = `${parts[1]}/${parts[2]}`; // MM/DD
        }

        return {
          name: label,
          current: Number(item.count) || 0,
        };
      })
    : [];



  return (
    <AdminLayout>
    <div className="space-y-6">
      
      {/* 1. Top Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1">
          {['12 months', '30 days', '7 days', '24 hours'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveTimeFilter(filter)}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTimeFilter === filter ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
          <Calendar size="18" /> Select dates
        </button>
      </div>

      {/* 2. Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{metric.label}</span>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-slate-900">{isAdminLoading || isPlatformLoading ? "..." : metric.value}</span>
              <span className={`flex items-center text-xs font-medium px-1.5 py-0.5 rounded ${metric.up ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
                {metric.trend} {metric.up ? <ArrowUp size="12" /> : <ArrowDown size="12" />}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Charts Grid Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* MRR Chart (Spans 2 columns) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-900">Monthly Recurring Revenue</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-bold text-slate-900">
                 {isFinancialLoading 
            ? "..." 
            : "₦" + Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(currentRevenue)}
        </span>
                {/* <span className="text-xs font-medium text-emerald-600 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded">
                  <ArrowUp size="12" color="#059669" className="mr-1" /> {financialData?.growthPercentage || "0%"} VS LAST YEAR
                </span> */}
              </div>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50">
              <DocumentDownload size="14" color="#475467"/> Export PDF
            </button>
          </div>
          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mrrData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(val) => Intl.NumberFormat('en-US', { notation: "compact" }).format(val)} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

       {/* Updated Churn Rate Card (Spans 1 column) */}
        <ChurnChart churnRate={globalChurnRate} plans={plans}/>

      </div>

      {/* 4. Charts Grid Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* New Signups (Spans 2 columns) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 lg:col-span-2 flex flex-col">
          <div className="mb-6">
            <h3 className="font-bold text-slate-900 mb-4">New Signups</h3>
            <div className="inline-flex bg-slate-50 border border-slate-200 rounded-lg p-1">
               {['12 months', '30 days', '7 days', '24 hours'].map((filter) => (
                  <button
                    key={`bar-${filter}`}
                    onClick={() => setActiveTimeFilter(filter)}
                    className={`px-3 py-1 text-[11px] font-medium rounded-md transition-colors ${
                      activeTimeFilter === filter ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
            </div>
          </div>
          <div className="flex-1 min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={signupsData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="current" fill="#3b82f6" radius={[4, 4, 0, 0]}  />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subscriptions (Spans 1 column) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col">
           <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900">Subscriptions</h3>
            <select className="text-[11px] font-medium text-slate-500 bg-transparent outline-none cursor-pointer">
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="flex-1 flex flex-col justify-between gap-4">
               {subscriptionBreakdown.map((sub: any, idx: number) => (
                 <div key={idx} className="space-y-1">
                   <div className="flex justify-between text-[10px] font-medium">
                     <span className="text-slate-500">{sub.name}</span>
                     <span className="text-slate-900">{sub.value}</span>
                   </div>
                   <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                     <div className={`h-full ${sub.color} rounded-full`} style={{ width: sub.percent }} />
                   </div>
                 </div>
               ))}
            </div>
          </div>

      </div>
    </div>
    </AdminLayout>
  );
};