import { z } from 'zod';

export const appSchema = z.object({
  // App config
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().default(3000),
});
