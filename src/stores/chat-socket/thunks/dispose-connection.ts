import { createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '@/stores/app-store';

import { ChatSocketMap } from '../chat-socket.slice';
import { ChatSocketSlicePayloads as Payloads } from '../types';

export const disposeConnection = createAsyncThunk<
  boolean,
  Payloads.User.DisposeConnection,
  { state: RootState }
>('chat-socket/socket/disposeConnection', (arg) => {
  const { conversationId } = arg;

  const socket = ChatSocketMap.store.get(conversationId);
  if (!socket?.connected) return false;

  socket.off();
  ChatSocketMap.store.delete(conversationId);

  return true;
});
