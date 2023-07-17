import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';

import { messageZod } from '@/types';
import { Logger, getZodDefault } from '@/utils';

import { RootState } from '../app-store';

import * as ChatSocketMap from './chat-socket.map';
import * as thunkActions from './thunks';
import { ChatSocketEntity, ChatSocketSlicePayloads as Payloads } from './types';

const adapter = createEntityAdapter<ChatSocketEntity>({
  selectId: ({ id }) => id,
});

const initialState = adapter.getInitialState();

export const CHAT_SOCKET_FEATURE_KEY = 'chat-socket';

export const chatSocketSlice = createSlice({
  name: CHAT_SOCKET_FEATURE_KEY,
  initialState,
  reducers: {
    set: adapter.setOne,

    addActiveUser(state, action: Payloads.User.UpdateActiveUser) {
      const { conversationId, id } = action.payload;

      const entity = state.entities[conversationId];
      if (!entity) return;

      const activeUserIndex = entity.activeUserIds.findIndex(
        (activeId) => activeId === id,
      );
      if (activeUserIndex !== -1) return;

      entity.activeUserIds.push(id);
    },

    removeActiveUser(state, action: Payloads.User.UpdateActiveUser) {
      const { conversationId, id } = action.payload;

      const entity = state.entities[conversationId];
      if (!entity) return;

      const activeUserIndex = entity.activeUserIds.findIndex(
        (activeId) => activeId === id,
      );
      if (activeUserIndex === -1) return;

      entity.activeUserIds.splice(activeUserIndex, 1);
    },

    addMessage(state, action: Payloads.Message.Add) {
      const { conversationId, ...message } = action.payload;

      const entity = state.entities[conversationId];
      if (!entity) return;

      const messageIsExists = entity.messages.some((m) => m.id === message.id);
      if (messageIsExists) {
        return Logger.info(
          '💬 Message is already exists!! (possibly due to Strict Mode)\n',
          message,
        );
      }

      entity.messages.push(message);
    },

    createMessage(state, action: Payloads.Message.Create) {
      const { conversationId, ...payload } = action.payload;

      const entity = state.entities[conversationId];
      if (!entity) return;

      // remarks: add newly created message with empty ID as `pending` status
      entity.messages.push({
        ...getZodDefault(messageZod),
        ...payload,
      });
    },

    resolvePendingMessage(state, action: Payloads.Message.ResolvePending) {
      const { conversationId, ...successMessage } = action.payload;

      const entity = state.entities[conversationId];
      if (!entity) return;

      const pendingIndex = entity.messages.findIndex(
        (message) => message.at === successMessage.at,
      );

      // note: debug
      // console.log('🚀 ~ file: chat-socket.slice.ts:90 ~ successMessage:\n', {
      //   pending: entity.messages[pendingIndex],
      //   successMessage,
      // });
      if (pendingIndex === -1) return;

      // sync with the server version of this message ff
      entity.messages[pendingIndex] = successMessage;
    },

    updateMessage(state, action: Payloads.Message.Update) {
      const { conversationId, ...messageToUpdate } = action.payload;

      const entity = state.entities[conversationId];
      if (!entity) return;

      const indexToUpdate = entity.messages.findIndex(
        (message) => message.id === messageToUpdate.id,
      );
      if (indexToUpdate === -1) return;

      entity.messages[indexToUpdate] = messageToUpdate;
    },

    deleteMessage(state, action: Payloads.Message.Delete) {
      const { conversationId, id: idToDelete } = action.payload;

      const entity = state.entities[conversationId];
      if (!entity) return;

      const messageToDeleteIndex = entity.messages.findIndex((m) => m.id === idToDelete);
      if (messageToDeleteIndex === -1) return;

      entity.messages.splice(messageToDeleteIndex, 1);
    },

    updateMessageSeenLog(state, action: Payloads.Message.UpdateSeenLog) {
      const { conversationId, messageId, userId } = action.payload;

      const entity = state.entities[conversationId];
      if (!entity) return;

      const seenLogToUpdateIndex = entity.messageSeenLog.findIndex(
        (log) => log.userId === userId,
      );
      if (seenLogToUpdateIndex === -1) return;

      entity.messageSeenLog[seenLogToUpdateIndex] = { userId, messageId };
    },

    upsertMessageError(state, action: Payloads.Message.UpsertError) {
      const { conversationId, payload, reason } = action.payload;

      const entity = state.entities[conversationId];
      if (!entity) return;

      const identifier = payload.at ?? payload.id;
      if (!identifier) return;

      entity.errorMessages[identifier] = { reason };
    },

    updateMessageTotalCount(state, action: Payloads.Message.UpdateTotalCount) {
      const { conversationId, totalMessageCount } = action.payload;

      const entity = state.entities[conversationId];
      if (!entity) return;

      entity.totalMessageCount = totalMessageCount;
    },

    prependMessages(state, action: Payloads.Message.AddHistories) {
      const { conversationId, messages } = action.payload;

      const entity = state.entities[conversationId];
      if (!entity) return;

      entity.messages.unshift(...messages);
    },
  },
});

export { ChatSocketMap };

export const chatSocketReducer = chatSocketSlice.reducer;
export const chatSocketActions = Object.assign(chatSocketSlice.actions, {
  socket: thunkActions,
});

// selector
const stateSelector = (state: RootState) => state[CHAT_SOCKET_FEATURE_KEY];
const entitySelectors = adapter.getSelectors();

export const chatSocketSelectors = {
  getAll: createSelector(stateSelector, entitySelectors.selectAll),
  getSize: createSelector(stateSelector, entitySelectors.selectTotal),
  getById: (id: ChatSocketEntity['id']) => {
    return createSelector(stateSelector, (state) => {
      return entitySelectors.selectById(state, id);
    });
  },
};
