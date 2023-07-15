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
  const { conversationId, content, userId } = arg;

  const socket = ChatSocketMap.store.get(conversationId);
  if (!socket?.connected) return;

  const payload = {
    at: new Date().getTime(), // identifier for pending state
    content,
    from: userId,
  };

  socket.emit(ChatSocketEmitter.Message.Events.SEND, payload);
  dispatch(chatSocketSlice.actions.createMessage({ ...arg, ...payload }));
});
