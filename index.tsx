import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase/config';
import { Loader2, BookOpen, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import Layout from '@/components/Layout';

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  // Redirect authenticated users to dashboard
  React.useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <Layout>
      <Head>
        <title>AI Academic Writer - Generate Professional Academic Papers</title>
        <meta name="description" content="Generate high-quality academic papers with real sources and proper citations using AI" />
      </Head>

      <main className="flex flex-col items-center">
        <section className="w-full py-20 px-4 sm:px-6 flex flex-col items-center bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-6">
              Professional Academic Papers <span className="text-accent-500">in Minutes</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Generate properly cited academic papers with real sources using advanced AI. Save time and focus on what matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push('/login')}
                variant="primary"
                size="lg"
                className="px-8"
              >
                Get Started
              </Button>
              <Button
                onClick={() => router.push('/pricing')}
                variant="outline"
                size="lg"
                className="px-8"
              >
                View Plans
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="w-8 h-8 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Enter Your Topic</h3>
                <p className="text-gray-600">
                  Simply enter your academic topic and choose your preferred citation format.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Generates Content</h3>
                <p className="text-gray-600">
                  Our AI searches for real, credible sources and generates a properly cited academic paper.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-primary-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Review & Use</h3>
                <p className="text-gray-600">
                  Review your paper, make edits if needed, and use it as a starting point for your work.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 px-4 sm:px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Save Time on Academic Writing?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of students and professionals who use our platform to streamline their academic writing process.
            </p>
            <Button
              onClick={() => router.push('/login')}
              variant="primary"
              size="lg"
              className="px-8"
            >
              Get Started
            </Button>
          </div>
        </section>
      </main>
    </Layout>
  );
}