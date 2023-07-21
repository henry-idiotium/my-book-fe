import { PayloadAction } from '@reduxjs/toolkit';

import { MessageEntity } from '@/types';

export type Wrap<T> = PayloadAction<T>;
export type ConvoWrap<T = object> = T & { conversationId: string };
export type ConvoPayloadWrap<T = object> = PayloadAction<ConvoWrap<T>>;

// message
export type MessagePayload = RequiredNotNullPick<MessageEntity, 'content'>;
export type WithMessageKeys<T extends keyof MessagePayload> = Pick<MessagePayload, T>;
