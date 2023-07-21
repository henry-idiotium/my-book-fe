import { createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '@/stores/app-store';
import { ChatSocketEmitter } from '@/types';

import { ChatSocketMap, chatSocketActions as actions } from '../chat-socket.slice';
import { ChatSocketSlicePayloads } from '../types';

import SeenArg = ChatSocketSlicePayloads.Thunk.Message.Seen;

/**
 * Emit SEEN MESSAGE event to server.
 * @remarks Dispatch needed to be executed by the UPDATE_SUCCESS listener.
 */
export const seenMessage = createAsyncThunk<void, SeenArg, { state: RootState }>(
  'chat-socket/socket/seenMessage',
  (arg, { dispatch }) => {
    const { conversationId, ...payload } = arg;

    const socket = ChatSocketMap.store.get(conversationId);
    if (!socket?.connected) return;

    socket.emit(ChatSocketEmitter.Message.Events.SEEN, { id: payload.messageId });
    dispatch(actions.updateMessageSeenLog(arg));
  },
);
