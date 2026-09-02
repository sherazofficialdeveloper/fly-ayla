import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Plane, 
  ArrowUpRight, 
  Clock 
} from 'lucide-react';

interface ReportsViewProps {
  reportsData: any;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ reportsData }) => {
  const [dateRange, setDateRange] = useState<'30d' | '90d' | 'year'>('30d');

  const summary = reportsData?.summary || {
    totalRevenue: 0,
    confirmedBookings: 0,
    activeFlightRequests: 0,
  };

  const revenueByMonth = reportsData?.revenueByMonth || [];

  const handleExportCsv = () => {
    const headers = ['Month', 'Gross Revenue (USD)', 'Completed Bookings'];
    const rows = revenueByMonth.map((r: any) => [r.month, r.revenue, r.bookings]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e: any) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fly_ayla_financial_report_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner & Export Action */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#0F0F16] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Financial & Operational Intelligence Reports
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Gross charter revenue, flight hours utilization, client retention, and Swift settlement tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-[#14141E] border border-white/10 text-xs font-semibold text-zinc-200 focus:outline-none focus:border-red-500 cursor-pointer"
          >
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last Quarter (90 Days)</option>
            <option value="year">Year to Date (YTD 2026)</option>
          </select>

          <button
            onClick={handleExportCsv}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-950/80 transition-all cursor-pointer whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0F0F16] border border-white/10 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Total Settled Revenue
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            ${summary.totalRevenue?.toLocaleString()}
          </div>
          <div className="text-xs text-zinc-400 font-normal">
            Average Charter Yield: $182,400 / mission
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F0F16] border border-white/10 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Total Block Hours Flown
          </div>
          <div className="text-2xl font-bold text-white">
            142.8 Hours
          </div>
          <div className="text-xs text-zinc-400 font-normal">
            Fleet Availability: 98.6%
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F0F16] border border-white/10 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Average Lead-to-Quote Time
          </div>
          <div className="text-2xl font-bold text-blue-400">
            4.2 Minutes
          </div>
          <div className="text-xs text-zinc-400 font-normal">
            DOC Engine Automated Accuracy: 99.8%
          </div>
        </div>
      </div>

      {/* Revenue by Month Visual Bar Chart */}
      <div className="p-6 rounded-2xl bg-[#0F0F16] border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Monthly Revenue Aggregation (USD)
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">Commercial charter bookings and ancillary management fees</p>
          </div>
          <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" /> +42.1% YoY
          </span>
        </div>

        {/* Custom Bar Graph */}
        {revenueByMonth.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center text-center p-6 bg-black/40 rounded-xl border border-white/5 space-y-2">
            <BarChart3 className="w-8 h-8 text-zinc-500" />
            <div className="text-xs text-zinc-300 font-semibold">No revenue transactions recorded for this period</div>
            <div className="text-xs text-zinc-400 font-normal">Charter payments and settlements will automatically populate monthly aggregation.</div>
          </div>
        ) : (
          <div className="h-56 flex items-end justify-between gap-4 pt-8 pb-2 px-4 bg-black/40 rounded-xl border border-white/5">
            {revenueByMonth.map((item: any, idx: number) => {
              const maxVal = Math.max(...revenueByMonth.map((r: any) => r.revenue || 0), 100000);
              const heightPercent = Math.min(100, Math.round((item.revenue / maxVal) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-xs text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity font-normal">
                    ${(item.revenue / 1000).toFixed(0)}k
                  </div>
                  <div
                    className="w-full max-w-[48px] rounded-t-lg bg-gradient-to-t from-red-800 to-red-500 group-hover:from-red-700 group-hover:to-red-400 transition-all shadow-lg shadow-red-950/80"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <div className="text-xs font-semibold text-zinc-300">
                    {item.month}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
