import { z } from 'zod';

export const authSchema = z.object({
  // Auth config
  AUTH_SECRET: z.string(),
  JWT_EXPIRATION_TIME: z.string(),
});
