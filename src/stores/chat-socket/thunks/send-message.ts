import { createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '@/stores/app-store';
import { ChatSocketEmitter } from '@/types';

import { ChatSocketMap, chatSocketSlice } from '../chat-socket.slice';
import { ChatSocketSlicePayloads as Payloads } from '../types';

/**
 * Emit SEND MESSAGE event to server.
 * @remarks Dispatch is executed along with emit event.
 */
export const sendMessage = createAsyncThunk<
  void,
  Payloads.Message.SocketSend,
  { state: RootState }
>('chat-socket/socket/sendMessage', (arg, { dispatch }) => {
  const { conversationId, ...payload } = arg;

  const socket = ChatSocketMap.store.get(conversationId);
  if (!socket?.connected) return;

  dispatch(chatSocketSlice.actions.createMessage(arg));
  socket.emit(ChatSocketEmitter.Message.Events.SEND, payload);
});
