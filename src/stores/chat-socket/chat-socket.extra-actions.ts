import { createAsyncThunk } from '@reduxjs/toolkit';

import { ChatSocketEmitter, messageZod } from '@/types';
import { getZodDefault } from '@/utils';

import { chatSocketSlice, ChatSocketMap } from './chat-socket.slice';

import Emitter = ChatSocketEmitter.Message;

const actions = chatSocketSlice.actions;

type ArgsWrapper<T> = T & { conversationId: string };
const initialMessage = getZodDefault(messageZod);

export const sendMessage = createAsyncThunk<
  void,
  ArgsWrapper<Pick<Emitter.Payloads.Send, 'content'>>
>('chat-socket/sendMessage', async (args, { dispatch }) => {
  const { conversationId, content } = args;

  const socket = ChatSocketMap.store.get(conversationId);
  if (!socket?.connected) return;

  const createAt = new Date(); // identifier for pending state

  socket.emit(Emitter.Events.SEND, { content, at: createAt });
  dispatch(actions.pendMessage({ conversationId, content, at: createAt }));
});

export const updateMessage = createAsyncThunk<
  void,
  ArgsWrapper<Emitter.Payloads.Update>
>('chat-socket/updateMessage', async (args, { dispatch }) => {
  const { conversationId, content, id } = args;

  const socket = ChatSocketMap.store.get(conversationId);
  if (!socket?.connected) return;

  socket.emit(Emitter.Events.UPDATE, { id, content });
  dispatch(
    actions.updateMessage({
      ...initialMessage,
      conversationId: id,
      content,
      isEdited: true,
      id,
    }),
  );
});

export const deleteMessage = createAsyncThunk<
  void,
  ArgsWrapper<Emitter.Payloads.Delete>
>('chat-socket/deleteMessage', async (args, { dispatch }) => {
  const { conversationId, id } = args;

  const socket = ChatSocketMap.store.get(conversationId);
  if (!socket?.connected) return;

  socket.emit(Emitter.Events.DELETE, { id });
});
