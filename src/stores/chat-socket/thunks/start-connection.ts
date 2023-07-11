import { createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '@/stores/app-store';

import { ChatSocketMap } from '../chat-socket.slice';
import {
  ChatSocketEntity,
  ChatSocketSlicePayloads as Payloads,
} from '../types';

export const startConnection = createAsyncThunk<
  ChatSocketEntity | undefined,
  Payloads.User.InitConversation,
  { state: RootState }
>('chat-socket/socket/startConnection', async (arg) => {
  const { conversationId, token } = arg;
  const result = await ChatSocketMap.connect(conversationId, token);
  if (!result) return;

  const { socket, ...chatSocketEntity } = result;

  return chatSocketEntity;
});
