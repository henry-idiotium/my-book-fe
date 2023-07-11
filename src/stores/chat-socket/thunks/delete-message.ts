import { createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '@/stores/app-store';
import { ChatSocketEmitter } from '@/types';

import { ChatSocketMap } from '../chat-socket.slice';
import { ChatSocketSlicePayloads as Payloads } from '../types';

/**
 * Emit DELETE MESSAGE event to server.
 * @remarks Dispatch needed to be executed by the DELETE_SUCCESS listener.
 */
export const deleteMessage = createAsyncThunk<
  void,
  Payloads.Message.SocketDelete,
  { state: RootState }
>('chat-socket/socket/deleteMessage', (arg) => {
  const { conversationId, ...payload } = arg;

  const socket = ChatSocketMap.store.get(conversationId);
  if (!socket?.connected) return;

  socket.emit(ChatSocketEmitter.Message.Events.DELETE, payload);
});
