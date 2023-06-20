import { z } from 'zod';

import { userZod } from '@/types';

export type AuthValidResponse = z.infer<typeof authValidResponseZod>;
const authValidResponseZod = z.object({
  token: z.string(),
  refresh: z.string(),
  user: userZod,
});
