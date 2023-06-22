import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

import { RootState } from '../app-store';

import Payload from './chat-socket.slice.types';

import { ChatSocketEntity, chatSocketEntityZod } from '@/types';
import { Convo, getZodDefault } from '@/utils';

export const CHAT_SOCKET_FEATURE_KEY = 'chat-socket';

const adapter = createEntityAdapter<ChatSocketEntity>();
const initialState = adapter.getInitialState();
const initialChatSocketEntity = getZodDefault(chatSocketEntityZod);

const chatSlice = createSlice({
  name: CHAT_SOCKET_FEATURE_KEY,
  initialState,
  reducers: {
    connectUser: (state, action: Payload.User.Connected) => {
      const { chatbox, userActiveCount } = action.payload;

      const isGroup = Convo.isGroup(chatbox);

      // clear messages in chatbox, and put it at base-level-props in the store
      const messages = structuredClone(chatbox.messages ?? []);
      delete chatbox.messages;

      // extract users
      const users = Object.fromEntries(
        (!isGroup ? chatbox.conversationBetween : chatbox.members ?? []).map(
          (user) => [user.id, user]
        )
      );

      // extract conversation
      const convo = {
        [isGroup ? 'conversationGroup' : 'conversation']: chatbox,
      };

      state.entities[chatbox.id] = {
        ...initialChatSocketEntity,
        ...convo,
        messages,
        users,
        userActiveCount,
      };
    },

    userDisconnected: (state, action: Payload.User.Disconnected) => {
      const { userId, convoId } = action.payload;

      const entity = state.entities[convoId];
      if (!entity) return;

      delete entity.users[userId];
      entity.userActiveCount -= 1;
    },

    userJoined: (state, action: Payload.User.Joined) => {
      const { userActiveCount, userJoinedId, convoId } = action.payload;

      const entity = state.entities[convoId];
      if (!entity) return;

      const activeUser = entity.users[userJoinedId];
      if (!activeUser || !activeUser.metadata) return;

      activeUser.metadata.isActive = true;
      entity.userActiveCount = userActiveCount;
    },

    messageReceived: (state, action: Payload.Message.Received) => {
      const { convoId, ...message } = action.payload;

      const entity = state.entities[convoId];
      if (!entity) return;

      entity.messages = [...entity.messages, message];
      entity.messagePending = null;
    },

    messagePending: (state, action: Payload.Message.Pending) => {
      const { convoId, content } = action.payload;

      const entity = state.entities[convoId];
      if (!entity) return;

      entity.messagePending = content;
    },

    messageDeleted: (state, action: Payload.Message.Deleted) => {
      const { convoId, id } = action.payload;

      const entity = state.entities[convoId];
      if (!entity) return;

      const messageId = entity.messages.findIndex((m) => m.id === id);
      if (messageId === -1) return;

      entity.messages[messageId] = {
        ...entity.messages[messageId],
        content: null,
      };
    },

    messageUpdated: (state, action: Payload.Message.Updated) => {
      const { convoId, id, content } = action.payload;

      const entity = state.entities[convoId];
      if (!entity) return;

      const messageId = entity.messages.findIndex((m) => m.id === id);
      if (messageId === -1) return;

      entity.messages[messageId] = {
        ...entity.messages[messageId],
        isEdited: true,
        content,
      };
    },
  },
});

export const chatSocketReducer = chatSlice.reducer;
export const chatSocketActions = chatSlice.actions;

// selector
const stateSelector = (state: RootState) => state[CHAT_SOCKET_FEATURE_KEY];

const { selectAll, selectById, selectTotal } = adapter.getSelectors();

export const selectChatSockets = createSelector(stateSelector, selectAll);
export const selectChatSocketTotal = createSelector(stateSelector, selectTotal);
export const selectChatSocketById = (id: ChatSocketEntity['convoId']) =>
  createSelector(stateSelector, (state) => selectById(state, id));

export * from './chat-socket.map';
