import { createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '@/stores/app-store';
import { ChatSocketEmitter } from '@/types';

import { ChatSocketMap } from '../chat-socket.slice';
import { ChatSocketSlicePayloads } from '../types';

import SocketPayload = ChatSocketSlicePayloads.Message.Socket;

/**
 * Emit SEND MESSAGE event to server.
 * @remarks Dispatch is executed along with emit event.
 */
export const sendMessage = createAsyncThunk<
  SocketPayload.Result.Send | undefined,
  SocketPayload.Arg.Send,
  { state: RootState }
>('chat-socket/socket/sendMessage', async (arg) => {
  const { conversationId, content, at, userId: from } = arg;

  const socket = ChatSocketMap.store.get(conversationId);
  if (!socket?.connected) return;

  // remarks: date is used as identifier for pending state
  const payload = { content, from, at };

  return await new Promise((resolve) => {
    socket.emit(ChatSocketEmitter.Message.Events.SEND, payload, (message) => {
      resolve({ conversationId, ...message });
    });
  });
});
