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
const initialMessage = getZodDefault(messageZod);

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

      const activeUserIndex = entity.activeUserIds.findIndex((activeId) => activeId === id);
      if (activeUserIndex !== -1) return;

      entity.activeUserIds.push(id);
    },

    removeActiveUser(state, action: Payloads.User.UpdateActiveUser) {
      const { conversationId, id } = action.payload;

      const entity = state.entities[conversationId];
      if (!entity) return;

      const activeUserIndex = entity.activeUserIds.findIndex((activeId) => activeId === id);
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

    updateFullMessage(state, action: Payloads.Message.FullUpdate) {
      const { conversationId, ...messageToUpdate } = action.payload;

      const entity = state.entities[conversationId];
      if (!entity) return;

      const indexToUpdate = entity.messages.findIndex(
        (message) => message.id === messageToUpdate.id,
      );
      if (indexToUpdate === -1) return;

      entity.messages[indexToUpdate] = messageToUpdate;
    },

    updateMessage(state, action: Payloads.Message.Update) {
      const { conversationId, content, id: messageId } = action.payload;

      const entity = state.entities[conversationId];
      if (!entity) return;

      const indexToUpdate = entity.messages.findIndex((message) => message.id === messageId);
      if (indexToUpdate === -1) return;

      entity.messages[indexToUpdate].content = content;
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

      const seenLogToUpdateIndex = entity.messageSeenLog.findIndex((log) => log.userId === userId);
      if (seenLogToUpdateIndex === -1) return;

      entity.messageSeenLog[seenLogToUpdateIndex] = { userId, messageId };
    },

    upsertMessageError(state, action: Payloads.Message.UpsertError) {
      const { conversationId, payload, reason } = action.payload;

      const entity = state.entities[conversationId];
      if (!entity) return;

      const identifier = payload.at ?? payload.id;
      if (!identifier) return;

      entity.meta.message.errors[identifier] = { reason };
    },

    prependMessages(state, action: Payloads.Message.PrependMessages) {
      const { conversationId, messages } = action.payload;

      const entity = state.entities[conversationId];
      if (!entity) return;

      entity.messages.unshift(...messages);
    },

    updateMessagesFetchingLog(state, action: Payloads.Message.UpdateFetchingLog) {
      const { conversationId, ...payload } = action.payload;

      const entity = state.entities[conversationId];
      if (!entity) return;

      entity.meta.message.prevFetch = payload;
    },
  },

  extraReducers(builder) {
    /** Add message (pending state) */
    builder.addCase(thunkActions.sendMessage.pending, (state, action) => {
      const { conversationId, ...partialMessage } = action.meta.arg;

      const entity = state.entities[conversationId];
      if (!entity) return;

      entity.messages.push({
        ...initialMessage,
        ...partialMessage,
      });
    });

    /** Resolve pending message */
    builder.addCase(thunkActions.sendMessage.fulfilled, (state, action) => {
      if (!action.payload) return;

      const { conversationId, ...successMessage } = action.payload;

      const entity = state.entities[conversationId];
      if (!entity) return;

      const pendingIndex = entity.messages.findIndex((message) => {
        const msgTime = new Date(message.at).getTime();
        const successMsgTime = new Date(successMessage.at).getTime();
        return msgTime === successMsgTime;
      });
      if (pendingIndex === -1) return;

      // sync with the server version of this message
      entity.messages[pendingIndex] = successMessage;
    });
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
