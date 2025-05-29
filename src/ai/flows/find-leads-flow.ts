
'use server';
/**
 * @fileOverview An AI flow to find potential leads based on provided criteria.
 *
 * - findLeads - A function that handles the lead finding process.
 * - FindLeadsInput - The input type for the findLeads function.
 * - FindLeadsOutput - The return type for the findLeads function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for finding leads
const FindLeadsInputSchema = z.object({
  targetName: z.string().optional().describe('A specific person or company name to look for.'),
  targetTitle: z.string().optional().describe('Desired job title or role of the contact (e.g., CEO, Marketing Manager).'),
  targetLocation: z.string().optional().describe('Geographic location to target (e.g., "San Francisco, CA", "London, UK").'),
  targetIndustry: z.string().optional().describe('Specific industry to target (e.g., SaaS, Healthcare, E-commerce).'),
  targetEmployeeCount: z.string().optional().describe('Estimated employee count range of the target company (e.g., "1-10", "50-200", "1000+").'),
  targetRevenue: z.string().optional().describe('Estimated annual revenue range of the target company (e.g., "$1M-$5M", "$10M+").'),
  keywords: z.string().optional().describe('General keywords related to the services they might need or their business (e.g., "digital marketing", "software development", "b2b services").')
});
export type FindLeadsInput = z.infer<typeof FindLeadsInputSchema>;

// Define the output schema for each found lead
const FoundLeadSchema = z.object({
  companyName: z.string().describe('The name of the company.'),
  potentialContactName: z.string().optional().describe('The name of a potential contact person at the company.'),
  potentialContactTitle: z.string().optional().describe('The job title of the potential contact person.'),
  reasoning: z.string().describe('A brief explanation of why this company/person might be a good lead based on the criteria.'),
  website: z.string().url().optional().describe("The company's website URL. Example: https://www.example.com"),
  contactEmail: z.string().optional().describe('A potential contact email address for the lead. Should be a business email if possible. Example: contact@example.com'),
  contactPhone: z.string().optional().describe('A potential contact phone number for the lead. Should be a business phone if possible. Example: +1-555-123-4567'),
  industry: z.string().optional().describe('The industry of the company.'),
  location: z.string().optional().describe('The location of the company.'),
});
export type FoundLead = z.infer<typeof FoundLeadSchema>;

// Define the output schema for the flow
const FindLeadsOutputSchema = z.object({
  foundLeads: z.array(FoundLeadSchema).describe('A list of potential leads found based on the input criteria.'),
});
export type FindLeadsOutput = z.infer<typeof FindLeadsOutputSchema>;


// The actual Genkit flow definition
const findLeadsGenkitFlow = ai.defineFlow(
  {
    name: 'findLeadsGenkitFlow',
    inputSchema: FindLeadsInputSchema,
    outputSchema: FindLeadsOutputSchema,
  },
  async (input) => {
    const prompt = ai.definePrompt({
        name: 'findLeadsPrompt',
        input: { schema: FindLeadsInputSchema },
        output: { schema: FindLeadsOutputSchema },
        prompt: `
        You are an expert B2B lead generation assistant. Your task is to find potential business leads based on the following criteria.
        Provide up to 5 high-quality leads. For each lead, provide the company name, a potential contact person's name and their title if available,
        a brief reasoning why they are a good fit, their website URL, and if possible, a business email address and phone number for the contact or company.
        Also include the company's industry and location if identified.

        Search Criteria:
        ${input.targetName ? `- Specific Name/Company: ${input.targetName}` : ''}
        ${input.targetTitle ? `- Target Contact Title: ${input.targetTitle}` : ''}
        ${input.targetLocation ? `- Location: ${input.targetLocation}` : ''}
        ${input.targetIndustry ? `- Industry: ${input.targetIndustry}` : ''}
        ${input.targetEmployeeCount ? `- Employee Count: ${input.targetEmployeeCount}` : ''}
        ${input.targetRevenue ? `- Revenue: ${input.targetRevenue}` : ''}
        ${input.keywords ? `- Keywords: ${input.keywords}` : ''}

        If some criteria are not provided, use your best judgment to find relevant leads.
        Focus on providing actionable information. Ensure website URLs are valid.
        Prioritize leads that closely match the provided criteria.
        Format your output as a JSON object matching the provided schema.
        `,
        // config: { model: 'googleai/gemini-1.5-flash-latest' } // Or your preferred model
    });

    const { output } = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate leads.");
    }
    return output;
  }
);

// Exported wrapper function to be called from the frontend
export async function findLeads(input: FindLeadsInput): Promise<FindLeadsOutput> {
  return findLeadsGenkitFlow(input);
}
