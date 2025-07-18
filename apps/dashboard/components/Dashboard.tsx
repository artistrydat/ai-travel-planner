
import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import StatCard from './StatCard';
import PurchaseChart from './PurchaseChart';
import TransactionsTable from './TransactionsTable';
import Loading from './Loading';
import { DollarSignIcon, ShoppingCartIcon, RefundIcon } from './icons';

const Dashboard: React.FC = () => {
  const stats = useQuery(api.queries.getDashboardStats);
  const recentTransactions = useQuery(api.queries.getRecentTransactions);
  const salesByDay = useQuery(api.queries.getSalesByDay);

  const isLoading =
    stats === undefined ||
    recentTransactions === undefined ||
    salesByDay === undefined;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard
          title="Total Revenue"
          value={`${stats.totalRevenue} ⭐`}
          icon={<DollarSignIcon />}
        />
        <StatCard
          title="Total Purchases"
          value={stats.purchaseCount.toString()}
          icon={<ShoppingCartIcon />}
        />
        <StatCard
          title="Total Refunds"
          value={stats.refundCount.toString()}
          icon={<RefundIcon />}
        />
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="rounded-lg bg-slate-800 p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">
            Purchases (Last 30 Days)
          </h2>
          <PurchaseChart data={salesByDay} />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white mb-4">
          Recent Transactions
        </h2>
        <TransactionsTable transactions={recentTransactions} />
      </div>
    </div>
  );
};

export default Dashboard;
