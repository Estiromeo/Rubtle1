import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: false, // Only use in API routes, never client-side
});

// Generate academic paper
export const generateAcademicPaper = async (topic: string, citationFormat: string) => {
  try {
    const prompt = createPrompt(topic, citationFormat);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { 
          role: "system", 
          content: "You are an academic writing assistant that can browse the internet to find relevant, recent, and credible sources for academic papers."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating academic paper:', error);
    throw new Error('Failed to generate paper. Please try again later.');
  }
};

// Humanize text
export const humanizeText = async (text: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { 
          role: "system", 
          content: "You are an expert in making academic writing sound more natural and personal, while maintaining its academic quality and keeping all citations and references intact."
        },
        { 
          role: "user", 
          content: `Please rewrite the following academic text to sound more natural and human-written, while preserving all citations, references, and academic quality:\n\n${text}`
        }
      ],
      temperature: 0.8,
      max_tokens: 4000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0.3,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error humanizing text:', error);
    throw new Error('Failed to humanize text. Please try again later.');
  }
};

// Create prompt for OpenAI
const createPrompt = (topic: string, citationFormat: string) => {
  return `
    Act as a professional academic writer. Browse the internet to find reliable, recent, and academic sources about the topic: "${topic}".
    
    Write a comprehensive academic paper with:
    1. A clear introduction that presents the topic and thesis
    2. A well-structured body divided into relevant sections and subsections
    3. A conclusion that summarizes the findings
    4. In-text citations using ${citationFormat} format
    5. A bibliography/references section at the end with all sources used, formatted in ${citationFormat} style
    
    Requirements:
    - Use at least 5-7 credible and recent academic sources found online
    - Include proper in-text citations for all claims and information from sources
    - Structure the paper logically with clear section headings
    - Use formal academic language but maintain readability
    - Create a complete bibliography with all sources properly formatted in ${citationFormat} style
    - For online sources, include access dates and URLs when required by the citation format
    
    Important: All sources must be real and academically credible. Prioritize peer-reviewed journals, academic publications, and reputable institutional websites.
  `;
};