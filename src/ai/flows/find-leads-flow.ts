
'use server';
/**
 * @fileOverview AI-powered lead finder.
 *
 * - findLeads - A function that finds potential leads based on specified criteria.
 * - FindLeadsInput - The input type for the findLeads function.
 * - FindLeadsOutput - The return type for the findLeads function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindLeadsInputSchema = z.object({
  industry: z.string().describe('The target industry to search for leads. (e.g., "Software as a Service", "Healthcare Technology")'),
  location: z.string().optional().describe('The geographical location (e.g., "San Francisco, CA", "London, UK", "Germany") to focus the search. Optional.'),
  keywords: z.string().optional().describe('Specific keywords, services, or company types the potential leads might be related to or looking for (e.g., "CRM solutions", "digital marketing agencies", "companies using HubSpot"). Optional.'),
});
export type FindLeadsInput = z.infer<typeof FindLeadsInputSchema>;

const PotentialLeadSchema = z.object({
  companyName: z.string().describe('The name of the potential lead company.'),
  potentialContactTitle: z.string().optional().describe('A suggested contact person or title within the company (e.g., "Head of Marketing", "VP of Sales", "Founder").'),
  reasoning: z.string().describe('A brief (1-2 sentences) explanation of why this company is a good potential lead based on the provided criteria.'),
  website: z.string().optional().describe('The company\'s website URL, if found.'),
  estimatedCompanySize: z.string().optional().describe('An estimated size of the company (e.g., "10-50 employees", "Startup", "Large Enterprise").'),
  keyProductOrService: z.string().optional().describe('A key product or service offered by the company relevant to the search criteria.'),
});

const FindLeadsOutputSchema = z.object({
  potentialLeads: z.array(PotentialLeadSchema).describe('A list of 3-5 potential leads found based on the criteria.'),
});
export type FindLeadsOutput = z.infer<typeof FindLeadsOutputSchema>;

export async function findLeads(input: FindLeadsInput): Promise<FindLeadsOutput> {
  return findLeadsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findLeadsPrompt',
  input: {schema: FindLeadsInputSchema},
  output: {schema: FindLeadsOutputSchema},
  prompt: `You are an expert B2B Lead Generation Specialist. Your task is to identify 3 to 5 potential business leads based on the criteria provided by the user.

For each lead, provide:
1.  Company Name
2.  Potential Contact Title (e.g., "Head of Marketing", "Founder", "VP of Engineering") - be specific if possible.
3.  Reasoning: A concise explanation (1-2 sentences) for why this company is a strong potential lead given the user's criteria.
4.  Website: The company's official website URL.
5.  Estimated Company Size: (e.g., "Startup (1-10 employees)", "SME (50-200 employees)", "Large Enterprise (1000+ employees)")
6.  Key Product/Service: A brief mention of their main offering relevant to the search.

User Criteria:
- Target Industry: {{{industry}}}
{{#if location}}
- Location Focus: {{{location}}}
{{/if}}
{{#if keywords}}
- Specific Keywords/Interests: {{{keywords}}}
{{/if}}

Based on these criteria, generate a list of potential leads. Ensure the information is as accurate and relevant as possible. If you cannot find specific information, you can omit optional fields but always provide Company Name and Reasoning.
`,
});

const findLeadsFlow = ai.defineFlow(
  {
    name: 'findLeadsFlow',
    inputSchema: FindLeadsInputSchema,
    outputSchema: FindLeadsOutputSchema,
  },
  async input => {
    // Basic input validation or sanitation could go here if needed
    if (!input.industry) {
        throw new Error("Target industry is required to find leads.");
    }
    const {output} = await prompt(input);
    return output!;
  }
);
