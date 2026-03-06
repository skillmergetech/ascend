'use server';
/**
 * @fileOverview An AI assistant that helps users define clear, actionable, and SMART goals.
 *
 * - defineGoal - A function that guides the user through defining a SMART goal.
 * - GoalDefinitionAssistantInput - The input type for the defineGoal function.
 * - GoalDefinitionAssistantOutput - The return type for the defineGoal function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GoalDefinitionAssistantInputSchema = z.object({
  initialGoalIdea: z
    .string()
    .describe("The user's initial idea or concept for a goal, which may not be fully formed or SMART."),
  context: z
    .string()
    .optional()
    .describe(
      'Any additional context or background information about the user\u0027s situation, motivations, or current resources relevant to this goal.'
    ),
  timeframe: z
    .string()
    .optional()
    .describe(
      'The desired timeframe for achieving this goal (e.g., "within 3 months", "by end of year", "over the next 6 weeks").'
    ),
});
export type GoalDefinitionAssistantInput = z.infer<
  typeof GoalDefinitionAssistantInputSchema
>;

const GoalDefinitionAssistantOutputSchema = z.object({
  refinedGoal: z
    .string()
    .describe(
      "A clearly articulated, SMART-compliant version of the user's goal, written as a concise and motivating statement."
    ),
  smartBreakdown: z
    .object({
      specific: z
        .string()
        .describe(
          'What exactly is the goal? Who is involved? What are the conditions or scope? Be precise.'
        ),
      measurable: z
        .string()
        .describe(
          'How will you track progress? What are the metrics or indicators of success? How will you know when the goal is achieved?'
        ),
      achievable: z
        .string()
        .describe(
          'Is the goal realistic and attainable given available resources, time, and skills? Outline how it can be achieved.'
        ),
      relevant: z
        .string()
        .describe(
          'Why is this goal important to you? How does it align with your values, long-term aspirations, or other objectives?'
        ),
      timeBound: z
        .string()
        .describe(
          'What is the specific deadline or timeframe for achieving this goal? Include milestones if applicable.'
        ),
    })
    .describe('A breakdown of the refined goal into its SMART components.'),
  actionableSteps: z
    .array(z.string())
    .describe(
      'A list of 3-5 initial, concrete, and actionable steps the user can take immediately to start working towards the goal.'
    ),
});
export type GoalDefinitionAssistantOutput = z.infer<
  typeof GoalDefinitionAssistantOutputSchema
>;

export async function defineGoal(
  input: GoalDefinitionAssistantInput
): Promise<GoalDefinitionAssistantOutput> {
  return goalDefinitionAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'goalDefinitionAssistantPrompt',
  input: { schema: GoalDefinitionAssistantInputSchema },
  output: { schema: GoalDefinitionAssistantOutputSchema },
  prompt: `You are an expert goal-setting coach and assistant for the 'Ascend' application, which focuses on structured personal development.
Your task is to take a user's initial goal idea and transform it into a clear, actionable, and SMART (Specific, Measurable, Achievable, Relevant, Time-bound) goal.
Provide a motivating refined goal statement, a detailed breakdown of each SMART component, and a few actionable initial steps.

User's Initial Goal Idea: {{{initialGoalIdea}}}
{{#if context}}Additional Context: {{{context}}}{{/if}}
{{#if timeframe}}Desired Timeframe: {{{timeframe}}}{{/if}}

Think step-by-step to ensure the goal is truly SMART. First, rephrase the goal to be specific. Then, identify how to measure its success. Next, ensure it's achievable by considering the user's context and timeframe. Explain its relevance. Finally, explicitly state the time-bound aspect. Provide 3-5 initial actionable steps.
`,
});

const goalDefinitionAssistantFlow = ai.defineFlow(
  {
    name: 'goalDefinitionAssistantFlow',
    inputSchema: GoalDefinitionAssistantInputSchema,
    outputSchema: GoalDefinitionAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
