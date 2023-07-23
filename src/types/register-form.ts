import { z } from 'zod';

export type RegisterForm = z.infer<typeof registerFormZod>;
export const registerFormZod = z
  .object({
    email: z.string().email('Invalid email').min(1, 'Email is required'),
    firstName: z.string().min(1, 'First name is required').max(100),
    lastName: z.string().min(1, 'Last name is required').max(100),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must have more than 6 characters'),
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
    address: z.string().optional(),
    terms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms and conditions' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });
