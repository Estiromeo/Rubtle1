import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase/config';
import { PLANS } from '@/lib/firebase/auth';
import { CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Layout from '@/components/Layout';

export default function Pricing() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const handleSelectPlan = (planType: string) => {
    if (!user) {
      router.push('/login?redirect=pricing');
      return;
    }

    router.push(`/checkout?plan=${planType}`);
  };

  return (
    <Layout>
      <Head>
        <title>Pricing - AI Academic Writer</title>
      </Head>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that works best for you. All plans include access to our AI academic paper generator.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Free</h2>
              <p className="text-gray-600 mb-4">Perfect for trying out the platform</p>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600 ml-2">/month</span>
              </div>
              <Button
                onClick={() => handleSelectPlan('FREE')}
                variant="outline"
                className="w-full mb-6"
              >
                {user ? 'Current Plan' : 'Get Started'}
              </Button>
              <ul className="space-y-3">
                <Feature text={`${PLANS.FREE.credits} credits per month`} />
                <Feature text={`${PLANS.FREE.maxCharacters.toLocaleString()} characters per generation`} />
                <Feature text="AI-generated academic papers" />
                <Feature text="Real citations and references" />
              </ul>
            </div>
          </div>

          {/* Student Plan */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border-2 border-primary-500 relative">
            <div className="bg-primary-500 text-white text-center py-1 text-sm font-semibold">
              MOST POPULAR
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Student</h2>
              <p className="text-gray-600 mb-4">Perfect for students and academics</p>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold text-gray-900">$12</span>
                <span className="text-gray-600 ml-2">/month</span>
              </div>
              <Button
                onClick={() => handleSelectPlan('STUDENT')}
                variant="primary"
                className="w-full mb-6"
              >
                {user ? 'Upgrade' : 'Get Started'}
              </Button>
              <ul className="space-y-3">
                <Feature text={`${PLANS.STUDENT.credits} credits per month`} />
                <Feature text={`${PLANS.STUDENT.maxCharacters.toLocaleString()} characters per generation`} />
                <Feature text="AI-generated academic papers" />
                <Feature text="Real citations and references" />
                <Feature text="Text humanization" />
                <Feature text="Priority support" />
              </ul>
            </div>
          </div>

          {/* Professional Plan */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional</h2>
              <p className="text-gray-600 mb-4">For educators and professionals</p>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold text-gray-900">$29</span>
                <span className="text-gray-600 ml-2">/month</span>
              </div>
              <Button
                onClick={() => handleSelectPlan('PROFESSIONAL')}
                variant="outline"
                className="w-full mb-6"
              >
                {user ? 'Upgrade' : 'Get Started'}
              </Button>
              <ul className="space-y-3">
                <Feature text={`${PLANS.PROFESSIONAL.credits} credits per month`} />
                <Feature text={`${PLANS.PROFESSIONAL.maxCharacters.toLocaleString()} characters per generation`} />
                <Feature text="AI-generated academic papers" />
                <Feature text="Real citations and references" />
                <Feature text="Text humanization" />
                <Feature text="Priority support" />
                <Feature text="Advanced customization options" />
              </ul>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

const Feature = ({ text }: { text: string }) => (
  <li className="flex items-start">
    <CheckCircle className="h-5 w-5 text-accent-500 mt-0.5 mr-2 flex-shrink-0" />
    <span className="text-gray-600">{text}</span>
  </li>
);