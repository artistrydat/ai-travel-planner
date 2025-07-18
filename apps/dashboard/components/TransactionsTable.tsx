
import React from 'react';
import { Doc } from '../../../convex/_generated/dataModel';

type Transaction = (Doc<'purchases'> & { type: 'purchase' }) | (Doc<'refunds'> & { type: 'refund' });

interface TransactionsTableProps {
  transactions: Transaction[] | undefined;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions }) => {
  if (!transactions) {
    return <div className="text-center text-slate-400">Loading transactions...</div>;
  }

  if (transactions.length === 0) {
    return <div className="text-center text-slate-400 p-8 bg-slate-800 rounded-lg">No recent transactions found.</div>
  }
  
  return (
    <div className="overflow-x-auto rounded-lg bg-slate-800 shadow-lg">
      <table className="min-w-full divide-y divide-slate-700">
        <thead className="bg-slate-700">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-300">Type</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-300">Details</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-300">Amount</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-300">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {transactions.map((tx) => (
            <tr key={tx._id} className="hover:bg-slate-700/50">
              <td className="px-6 py-4 whitespace-nowrap">
                {tx.type === 'purchase' ? (
                  <span className="inline-flex items-center rounded-full bg-green-900/50 px-2.5 py-0.5 text-xs font-medium text-green-300">
                    Purchase
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-yellow-900/50 px-2.5 py-0.5 text-xs font-medium text-yellow-300">
                    Refund
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                <div className="font-medium text-white">{tx.type === 'purchase' ? tx.itemName : `Refund for Charge`}</div>
                <div className="text-slate-400">User ID: {tx.userId}</div>
                <div className="text-slate-500 text-xs">Charge ID: {tx.telegramChargeId}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {tx.type === 'purchase' ? (
                  <span className="font-semibold text-green-400">{tx.price} ⭐</span>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                {new Date(tx._creationTime).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
