import { createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '@/stores/app-store';
import { ChatSocketEmitter } from '@/types';

import { ChatSocketMap, chatSocketActions } from '../chat-socket.slice';
import { ChatSocketSlicePayloads } from '../types';

import DeleteArg = ChatSocketSlicePayloads.Thunk.Message.Delete;

/**
 * Emit DELETE MESSAGE event to server.
 * @remarks Dispatch needed to be executed by the DELETE_SUCCESS listener.
 */
export const deleteMessage = createAsyncThunk<void, DeleteArg, { state: RootState }>(
  'chat-socket/socket/deleteMessage',
  (arg, { dispatch }) => {
    const { conversationId, ...payload } = arg;

    const socket = ChatSocketMap.store.get(conversationId);
    if (!socket?.connected) return;

    socket.emit(ChatSocketEmitter.Message.Events.DELETE, payload);
    dispatch(chatSocketActions.deleteMessage(arg));
  },
);
