import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Research notebook: technical articles, experiments and engineering notes.
 * Publish an entry by adding a Markdown file to src/content/notes/, e.g.
 *
 *   ---
 *   title: Handing a live call from an AI agent to a person
 *   description: What context a human needs in the first three seconds.
 *   date: 2026-11-02
 *   kind: engineering        # research | engineering | experiment
 *   area: A.01               # optional, links to a focus area on /research
 *   ---
 *
 * Files starting with an underscore are ignored.
 */
const notes = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!**/_*.md'], base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    kind: z.enum(['research', 'engineering', 'experiment']),
    area: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { notes };
