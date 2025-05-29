
/**
 * @fileOverview Genkit development server configuration.
 * This file is used to import and register Genkit flows for local development.
 */
import { config } from 'dotenv';
config(); // Load environment variables

// Import your flows here to make them available to the Genkit development tools
import '@/ai/flows/find-leads-flow'; // Example: import your find leads flow

// You can also import other Genkit artifacts like prompts or tools if needed
// import '@/ai/prompts/your-prompt';
// import '@/ai/tools/your-tool';

console.log('Genkit development server configured. Imported flows should be available.');
