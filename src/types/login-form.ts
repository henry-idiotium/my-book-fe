import { z } from 'zod';

export type LoginForm = z.infer<typeof loginFormZod>;
export const loginFormZod = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email({
    message: 'Must be a valid email',
  }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});
