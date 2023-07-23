import { createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '@/stores/app-store';
import { ChatSocketEmitter } from '@/types';

import {
  CHAT_SOCKET_FEATURE_KEY,
  ChatSocketMap,
  chatSocketActions as actions,
} from '../chat-socket.slice';
import { ChatSocketSlicePayloads } from '../types';

import SeenArg = ChatSocketSlicePayloads.Thunk.Message.Seen;

/**
 * Emit SEEN MESSAGE event to server.
 * @remarks Dispatch needed to be executed by the UPDATE_SUCCESS listener.
 */
export const seenMessage = createAsyncThunk<void, SeenArg, { state: RootState }>(
  'chat-socket/socket/seenMessage',
  (arg, { dispatch, getState }) => {
    const { conversationId, userId } = arg;

    const entity = getState()[CHAT_SOCKET_FEATURE_KEY].entities[conversationId];
    const socket = ChatSocketMap.store.get(conversationId);
    if (!socket?.connected || !entity) return;

    const messageId = entity.messages.filter((m) => m.from !== userId).at(-1)?.id;
    if (!messageId) return;

    const existingLog = entity.messageSeenLog[userId];
    const logExisted = !!existingLog && existingLog === messageId;
    if (logExisted) return;

    socket.emit(ChatSocketEmitter.Message.Events.SEEN, { id: messageId });
    dispatch(actions.updateMessageSeenLog({ conversationId, userId, messageId }));
  },
);
