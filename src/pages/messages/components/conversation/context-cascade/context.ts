import { z } from 'zod';

import { chatSocketEntityZod } from '@/stores/chat-socket/types';
import { getZodDefault } from '@/utils';
import { createContext } from 'react';
import { CascadeReducerAction } from './reducer';

export type ConversationCascadeState = z.infer<typeof convoCascadeStateZod>;
const convoCascadeStateZod = z.object({
  chatSocketState: chatSocketEntityZod.required({ name: true }),
  scrollContentToEnd: z.function().returns(z.void()).optional(),
});
export const initialCascadeState = getZodDefault(convoCascadeStateZod);

type CascadeContext = {
  state: ConversationCascadeState;
  dispatch: React.Dispatch<CascadeReducerAction>;
};
export const ConversationCascadeStateContext = createContext<CascadeContext>({
  state: initialCascadeState,
  dispatch: () => {},
});
