import type { NextApiRequest, NextApiResponse } from 'next';
import { auth } from '@/lib/firebase/config';
import { humanizeText } from '@/lib/openai';

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
    const { text, maxCharacters } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: 'Missing text field' });
    }

    // Check if text length is within limits
    if (text.length > maxCharacters) {
      return res.status(400).json({ 
        message: 'Text exceeds character limit. Please use a shorter text or upgrade your plan.' 
      });
    }

    // Humanize the text
    const humanizedText = await humanizeText(text);
    
    // Check if humanized text exceeds character limit
    if (humanizedText.length > maxCharacters) {
      const truncatedText = humanizedText.substring(0, maxCharacters);
      return res.status(200).json({ 
        text: truncatedText,
        truncated: true,
        message: 'Text was truncated due to character limit. Upgrade your plan for longer papers.'
      });
    }

    return res.status(200).json({ text: humanizedText });
  } catch (error: any) {
    console.error('Error humanizing text:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}