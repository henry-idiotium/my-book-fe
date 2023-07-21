import { createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '@/stores/app-store';
import { ChatSocketEmitter } from '@/types';

import { ChatSocketMap, chatSocketActions } from '../chat-socket.slice';
import { ChatSocketSlicePayloads } from '../types';

import UpdateArg = ChatSocketSlicePayloads.Thunk.Message.Update;

/**
 * Emit UPDATE MESSAGE event to server.
 * @remarks Dispatch needed to be executed by the UPDATE_SUCCESS listener.
 */
export const updateMessage = createAsyncThunk<void, UpdateArg, { state: RootState }>(
  'chat-socket/socket/updateMessage',
  (arg, { dispatch }) => {
    const { conversationId, ...payload } = arg;

    const socket = ChatSocketMap.store.get(conversationId);
    if (!socket?.connected) return;

    socket.emit(ChatSocketEmitter.Message.Events.UPDATE, payload);
    dispatch(chatSocketActions.updateMessage(arg));
  },
);
