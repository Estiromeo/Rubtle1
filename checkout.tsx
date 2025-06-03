import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { PLANS, updateUserPlan } from '@/lib/firebase/auth';
import { Loader2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Layout from '@/components/Layout';

export default function Checkout() {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState<any>(null);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const { plan } = router.query;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=checkout');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          toast.error('Failed to load user data');
        } finally {
          setUserDataLoading(false);
        }
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  const getPlanDetails = () => {
    switch (plan) {
      case 'STUDENT':
        return {
          name: 'Student Plan',
          price: '$12/month',
          credits: PLANS.STUDENT.credits,
          maxChars: PLANS.STUDENT.maxCharacters.toLocaleString()
        };
      case 'PROFESSIONAL':
        return {
          name: 'Professional Plan',
          price: '$29/month',
          credits: PLANS.PROFESSIONAL.credits,
          maxChars: PLANS.PROFESSIONAL.maxCharacters.toLocaleString()
        };
      default:
        return {
          name: 'Free Plan',
          price: '$0/month',
          credits: PLANS.FREE.credits,
          maxChars: PLANS.FREE.maxCharacters.toLocaleString()
        };
    }
  };

  const handleProcessPayment = async () => {
    if (!user || !plan) return;

    setIsProcessing(true);

    try {
      // For demo purposes, we'll just update the plan without real payment
      await updateUserPlan(user.uid, plan as string);
      setIsSuccess(true);
      toast.success('Plan updated successfully!');
    } catch (error) {
      console.error('Error updating plan:', error);
      toast.error('Failed to update plan. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading || userDataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  const planDetails = getPlanDetails();

  if (isSuccess) {
    return (
      <Layout>
        <Head>
          <title>Checkout Success - AI Academic Writer</title>
        </Head>

        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm text-center">
            <div className="flex flex-col items-center">
              <CheckCircle className="w-16 h-16 text-accent-500 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
              <p className="text-gray-600">
                You have successfully subscribed to the {planDetails.name}.
              </p>
            </div>
            
            <div className="mt-6">
              <Button
                onClick={() => router.push('/dashboard')}
                variant="primary"
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Checkout - AI Academic Writer</title>
      </Head>

      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Checkout</h1>
            <p className="text-gray-600">
              You are subscribing to the {planDetails.name}.
            </p>
          </div>
          
          <div className="border-t border-b border-gray-200 py-4 my-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Plan</span>
              <span className="font-medium">{planDetails.name}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Price</span>
              <span className="font-medium">{planDetails.price}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Credits</span>
              <span className="font-medium">{planDetails.credits} per month</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Character Limit</span>
              <span className="font-medium">{planDetails.maxChars}</span>
            </div>
          </div>
          
          {/* For demo purposes, no actual payment form */}
          <div className="mt-6">
            <Button
              onClick={handleProcessPayment}
              variant="primary"
              className="w-full"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                `Pay ${planDetails.price.replace('/month', '')}`
              )}
            </Button>
            <p className="mt-2 text-center text-sm text-gray-600">
              This is a demo. No actual payment will be processed.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}