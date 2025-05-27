'use server';
/**
 * @fileOverview AI-powered email campaign generator.
 *
 * - generateEmailCampaign - A function that generates email campaigns based on target industry and message templates.
 * - GenerateEmailCampaignInput - The input type for the generateEmailCampaign function.
 * - GenerateEmailCampaignOutput - The return type for the generateEmailCampaign function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEmailCampaignInputSchema = z.object({
  targetIndustry: z
    .string()
    .describe('The target industry for the email campaign.'),
  messageTemplates: z
    .string()
    .describe('The message templates to use for the email campaign.'),
  campaignGoal: z
    .string()
    .describe('The goal of the email campaign'),
});
export type GenerateEmailCampaignInput = z.infer<
  typeof GenerateEmailCampaignInputSchema
>;

const GenerateEmailCampaignOutputSchema = z.object({
  emailCampaign: z
    .string()
    .describe('The generated email campaign content.'),
});
export type GenerateEmailCampaignOutput = z.infer<
  typeof GenerateEmailCampaignOutputSchema
>;

export async function generateEmailCampaign(
  input: GenerateEmailCampaignInput
): Promise<GenerateEmailCampaignOutput> {
  return generateEmailCampaignFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEmailCampaignPrompt',
  input: {schema: GenerateEmailCampaignInputSchema},
  output: {schema: GenerateEmailCampaignOutputSchema},
  prompt: `You are an AI email campaign generator. You will generate an email campaign based on the target industry, message templates and campaign goal provided.

Target Industry: {{{targetIndustry}}}
Message Templates: {{{messageTemplates}}}
Campaign Goal: {{{campaignGoal}}}

Email Campaign:`,
});

const generateEmailCampaignFlow = ai.defineFlow(
  {
    name: 'generateEmailCampaignFlow',
    inputSchema: GenerateEmailCampaignInputSchema,
    outputSchema: GenerateEmailCampaignOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
