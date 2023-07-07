import { PayloadAction } from '@reduxjs/toolkit';

export type Wrap<T> = PayloadAction<T>;
export type ConvoWrap<T> = PayloadAction<T & { conversationId: string }>;
