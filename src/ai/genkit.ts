
/**
 * @fileOverview Genkit client initialization.
 * This file initializes the Genkit instance with necessary plugins.
 */
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {config} from 'dotenv';

config(); // Load environment variables

export const ai = genkit({
  plugins: [
    googleAI({
      // apiKey: process.env.GEMINI_API_KEY, // Make sure GEMINI_API_KEY is in your .env
    }),
  ],
  // You can set a default model here if desired, or specify in each prompt/flow
  // model: 'googleai/gemini-1.5-flash-latest', 
  // Log level can be 'debug', 'info', 'warn', 'error'
  // logLevel: 'debug', // Removed, v1.x does not support logLevel here
  enableTracing: true, // Optional: useful for debugging
});
