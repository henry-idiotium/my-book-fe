import { z } from 'zod';

import { baseConversationResponseZod } from '../base-conversation-response';

import { pairedConversationZod } from './paired-conversation';

export type PairedConversationResponse = z.infer<typeof pairedConversationResponseZod>;
export const pairedConversationResponseZod = pairedConversationZod.merge(
  baseConversationResponseZod,
);
