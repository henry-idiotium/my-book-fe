import { z } from 'zod';

import { baseConversationZod } from '../base-conversation';

/** Conversation between two individuals.  */
export type PairedConversation = z.infer<typeof pairedConversationZod>;
export const pairedConversationZod = baseConversationZod.extend({});
