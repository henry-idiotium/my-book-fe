import { z } from 'zod';

import { baseConversationResponseZod } from '../base-conversation-response';

import { groupConversationZod } from './group-conversation';

export type GroupConversationResponse = z.infer<typeof groupConversationResponseZod>;
export const groupConversationResponseZod = groupConversationZod.merge(baseConversationResponseZod);
