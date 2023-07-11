import { PayloadAction } from '@reduxjs/toolkit';

export type Wrap<T> = PayloadAction<T>;
export type ConvoWrap<T = object> = T & { conversationId: string };
export type ConvoPayloadWrap<T = object> = PayloadAction<ConvoWrap<T>>;
