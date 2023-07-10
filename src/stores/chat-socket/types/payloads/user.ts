import { ConvoWrap } from './helpers';

export type InitConversation = ConvoWrap<{ token: string }>;
export type DisposeConnection = InitConversation;
