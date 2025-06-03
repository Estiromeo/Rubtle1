import React from 'react';
import Link from 'next/link';
import { Crown } from 'lucide-react';
import Button from '@/components/ui/Button';

interface DashboardHeaderProps {
  userData: {
    planType: string;
    credits: number;
    maxCharacters: number;
  } | null;
}

export default function DashboardHeader({ userData }: DashboardHeaderProps) {
  const getPlanInfo = () => {
    if (!userData) return { name: 'Loading...', badgeColor: 'bg-gray-200' };
    
    switch (userData.planType) {
      case 'FREE':
        return { name: 'Free Plan', badgeColor: 'bg-gray-200' };
      case 'STUDENT':
        return { name: 'Student Plan', badgeColor: 'bg-primary-100 text-primary-800' };
      case 'PROFESSIONAL':
        return { name: 'Professional Plan', badgeColor: 'bg-accent-100 text-accent-800' };
      default:
        return { name: 'Unknown Plan', badgeColor: 'bg-gray-200' };
    }
  };

  const { name, badgeColor } = getPlanInfo();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome to your Dashboard</h1>
          <p className="text-gray-600">Generate academic papers with AI using the form below.</p>
        </div>
        
        <div className="flex items-center mt-4 sm:mt-0">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${badgeColor} mr-3`}>
            {name}
          </span>
          
          {userData?.planType !== 'PROFESSIONAL' && (
            <Link href="/pricing">
              <Button variant="outline" size="sm" className="flex items-center">
                <Crown className="w-4 h-4 mr-1" />
                Upgrade
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}