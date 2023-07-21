import { EntityState } from '@reduxjs/toolkit';
import { z } from 'zod';

import { zodLiteralUnion } from '@/utils';

import { ChatSocketEntity } from './chat-socket-entity';

// todo: remove later

type foo = z.infer<typeof statusZod>;
const statusZod = z.object({
  status: zodLiteralUnion('not loaded', 'loading', 'loaded', 'error'),
  error: z.string().nullable().optional(),
});

const chatSocketExtraState = z.object({});

export type ChatSocketState = z.infer<typeof chatSocketExtraState> & EntityState<ChatSocketEntity>;
