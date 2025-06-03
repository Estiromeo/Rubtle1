import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface PaperGeneratorProps {
  onGenerate: (topic: string, citationFormat: string) => void;
  isGenerating: boolean;
  maxCharacters: number;
}

export default function PaperGenerator({ 
  onGenerate, 
  isGenerating,
  maxCharacters
}: PaperGeneratorProps) {
  const [topic, setTopic] = useState('');
  const [citationFormat, setCitationFormat] = useState('APA');
  const [topicError, setTopicError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      setTopicError('Please enter a topic');
      return;
    }
    
    if (topic.length > 500) {
      setTopicError('Topic is too long. Please limit to 500 characters.');
      return;
    }
    
    setTopicError('');
    onGenerate(topic, citationFormat);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Generate Academic Paper</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Input
              id="topic"
              label="Academic Topic"
              placeholder="e.g., Impact of climate change on coastal ecosystems"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              error={topicError}
              disabled={isGenerating}
            />
            <p className="mt-1 text-xs text-gray-500">
              Character count: {topic.length}/500
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Citation Format
            </label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              value={citationFormat}
              onChange={(e) => setCitationFormat(e.target.value)}
              disabled={isGenerating}
            >
              <option value="APA">APA</option>
              <option value="MLA">MLA</option>
              <option value="Chicago">Chicago</option>
            </select>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-2">
              Character limit: {maxCharacters.toLocaleString()} characters
            </p>
            
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                'Generate Paper'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}