import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { updateUserCredits } from '@/lib/firebase/auth';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Layout from '@/components/Layout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import PaperGenerator from '@/components/dashboard/PaperGenerator';
import TextEditor from '@/components/dashboard/TextEditor';
import CreditCounter from '@/components/dashboard/CreditCounter';

export default function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState<any>(null);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isHumanizing, setIsHumanizing] = useState(false);
  const router = useRouter();

  // Redirect if user is not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Listen for user data changes
  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(
        doc(db, 'users', user.uid),
        (doc) => {
          if (doc.exists()) {
            setUserData(doc.data());
          }
          setUserDataLoading(false);
        },
        (error) => {
          console.error('Error fetching user data:', error);
          toast.error('Failed to load user data');
          setUserDataLoading(false);
        }
      );

      return () => unsubscribe();
    }
  }, [user]);

  // Handle text generation
  const handleGenerateText = async (topic: string, citationFormat: string) => {
    if (!user || !userData) return;
    
    // Check if user has credits
    if (userData.credits <= 0) {
      toast.error('You have no credits left. Please upgrade your plan.');
      return;
    }

    setIsGenerating(true);
    setGeneratedText('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          topic, 
          citationFormat,
          maxCharacters: userData.maxCharacters
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate text');
      }

      const data = await response.json();
      setGeneratedText(data.text);
      
      // Update user credits
      await updateUserCredits(user.uid, userData.credits - 1);
      toast.success('Paper generated successfully!');
    } catch (error: any) {
      console.error('Generation error:', error);
      toast.error(error.message || 'Failed to generate paper. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle text humanization
  const handleHumanizeText = async () => {
    if (!user || !userData || !generatedText) return;
    
    // Check if user has credits
    if (userData.credits <= 0) {
      toast.error('You have no credits left. Please upgrade your plan.');
      return;
    }

    setIsHumanizing(true);

    try {
      const response = await fetch('/api/humanize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: generatedText,
          maxCharacters: userData.maxCharacters
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to humanize text');
      }

      const data = await response.json();
      setGeneratedText(data.text);
      
      // Update user credits
      await updateUserCredits(user.uid, userData.credits - 1);
      toast.success('Text humanized successfully!');
    } catch (error: any) {
      console.error('Humanization error:', error);
      toast.error(error.message || 'Failed to humanize text. Please try again.');
    } finally {
      setIsHumanizing(false);
    }
  };

  if (loading || userDataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Dashboard - AI Academic Writer</title>
      </Head>

      <main className="container mx-auto px-4 py-8">
        <DashboardHeader userData={userData} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <PaperGenerator 
                onGenerate={handleGenerateText} 
                isGenerating={isGenerating}
                maxCharacters={userData?.maxCharacters || 2000}
              />
              
              <div className="mt-6">
                <CreditCounter 
                  credits={userData?.credits || 0} 
                  planType={userData?.planType || 'FREE'} 
                />
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <TextEditor
              content={generatedText}
              isLoading={isGenerating}
              isHumanizing={isHumanizing}
              onHumanize={handleHumanizeText}
              hasCredits={userData?.credits > 0}
            />
          </div>
        </div>
      </main>
    </Layout>
  );
}