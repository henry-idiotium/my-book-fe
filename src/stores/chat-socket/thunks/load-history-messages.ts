import { createAsyncThunk } from '@reduxjs/toolkit';

import { RootState } from '@/stores/app-store';
import { ChatSocketEmitter } from '@/types';

import { ChatSocketMap, chatSocketActions as actions } from '../chat-socket.slice';
import { ChatSocketSlicePayloads } from '../types';

type LoadHistoryArg = ChatSocketSlicePayloads.Thunk.Message.LoadHistory;

/**
 * Emit LOAD HISTORY MESSAGES event to server.
 * @remarks Dispatch is executed along with emit event.
 */
export const loadHistoryMessages = createAsyncThunk<void, LoadHistoryArg, { state: RootState }>(
  'chat-socket/socket/loadHistoryMessages',
  (arg, { dispatch }) => {
    const { conversationId, ...payload } = arg;

    const socket = ChatSocketMap.store.get(conversationId);
    if (!socket?.connected) return;

    socket.emit(ChatSocketEmitter.Message.Events.LOAD_HISTORY, payload, (messages) => {
      dispatch(
        actions.updateMessagesFetchingLog({
          conversationId,
          size: messages.length,
          ...payload,
        }),
      );

      dispatch(actions.prependMessages({ conversationId, messages }));
    });
  },
);
