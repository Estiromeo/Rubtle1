import React from 'react';
import { Copy, Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import Button from '@/components/ui/Button';

interface TextEditorProps {
  content: string;
  isLoading: boolean;
  isHumanizing: boolean;
  onHumanize: () => void;
  hasCredits: boolean;
}

export default function TextEditor({
  content,
  isLoading,
  isHumanizing,
  onHumanize,
  hasCredits,
}: TextEditorProps) {
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy text');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm h-full">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Generated Paper</h2>
        <div className="flex space-x-2">
          {content && (
            <>
              <Button
                onClick={onHumanize}
                variant="secondary"
                size="sm"
                disabled={isLoading || isHumanizing || !hasCredits}
                className="flex items-center"
              >
                {isHumanizing ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-1" />
                )}
                Humanize
              </Button>
              <Button
                onClick={handleCopyToClipboard}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="p-6 h-[calc(100vh-18rem)] overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="w-10 h-10 animate-spin text-primary-500 mb-4" />
            <p className="text-gray-600">Generating your academic paper...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a minute or two.</p>
          </div>
        ) : content ? (
          <div className="editor-content">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-gray-50 rounded-full p-4 mb-4">
              <BookIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No paper generated yet</h3>
            <p className="text-gray-600 max-w-md">
              Enter an academic topic and select a citation format to generate a paper with real sources.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function BookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}