import type { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/lib/firebase/config';
import { generateAcademicPaper } from '@/lib/openai';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get session token from the request
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const token = authHeader.split('Bearer ')[1];
    
    // Verify token
    const decodedToken = await auth.verifyIdToken(token);
    if (!decodedToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get request data
    const { topic, citationFormat, maxCharacters } = req.body;
    
    if (!topic || !citationFormat) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if topic length is within limits
    if (topic.length > 500) {
      return res.status(400).json({ message: 'Topic is too long. Please limit to 500 characters.' });
    }

    // Generate the paper
    const generatedText = await generateAcademicPaper(topic, citationFormat);
    
    // Check if generated text exceeds character limit
    if (generatedText.length > maxCharacters) {
      const truncatedText = generatedText.substring(0, maxCharacters);
      return res.status(200).json({ 
        text: truncatedText,
        truncated: true,
        message: 'Text was truncated due to character limit. Upgrade your plan for longer papers.'
      });
    }

    return res.status(200).json({ text: generatedText });
  } catch (error: any) {
    console.error('Error generating paper:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}