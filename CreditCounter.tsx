import React from 'react';
import Link from 'next/link';
import { CreditCard } from 'lucide-react';

interface CreditCounterProps {
  credits: number;
  planType: string;
}

export default function CreditCounter({ credits, planType }: CreditCounterProps) {
  const getColorClass = () => {
    if (credits === 0) return 'text-red-500';
    if (credits < 3) return 'text-amber-500';
    return 'text-accent-500';
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-900">Credits Remaining</h3>
        {planType !== 'PROFESSIONAL' && (
          <Link href="/pricing" className="text-sm text-primary-600 hover:text-primary-800">
            Upgrade
          </Link>
        )}
      </div>
      
      <div className="flex items-center">
        <CreditCard className={`w-5 h-5 ${getColorClass()} mr-2`} />
        <span className={`text-xl font-bold ${getColorClass()}`}>{credits}</span>
      </div>
      
      <p className="mt-2 text-sm text-gray-600">
        Each paper generation or humanization uses 1 credit.
      </p>
      
      {credits === 0 && (
        <div className="mt-2 text-sm text-red-600">
          You have no credits left. Please upgrade your plan to continue.
        </div>
      )}
    </div>
  );
}