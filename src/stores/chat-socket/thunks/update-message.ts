import { createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '@/stores/app-store';
import { ChatSocketEmitter } from '@/types';

import { ChatSocketMap } from '../chat-socket.slice';
import { ChatSocketSlicePayloads as Payloads } from '../types';

/**
 * Emit UPDATE MESSAGE event to server.
 * @remarks Dispatch needed to be executed by the UPDATE_SUCCESS listener.
 */
export const updateMessage = createAsyncThunk<
  void,
  Payloads.Message.SocketUpdate,
  { state: RootState }
>('chat-socket/socket/updateMessage', (arg) => {
  const { conversationId, ...payload } = arg;

  const socket = ChatSocketMap.store.get(conversationId);
  if (!socket?.connected) return;

  socket.emit(ChatSocketEmitter.Message.Events.UPDATE, payload);
});
