import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

import { RootState } from '../app-store';

import { ChatSocketEntity, chatSocketEntityZod, Payload } from './types';

import { messageZod } from '@/types';
import { Convo, getZodDefault } from '@/utils';

export * from './chat-socket.map';

export const CHAT_SOCKET_FEATURE_KEY = 'chat-socket';

const adapter = createEntityAdapter<ChatSocketEntity>();
const initialState = adapter.getInitialState();
const initialChatSocketEntity = getZodDefault(chatSocketEntityZod);
const initialMessage = getZodDefault(messageZod);

const chatSocketSlice = createSlice({
  name: CHAT_SOCKET_FEATURE_KEY,
  initialState,
  reducers: {
    addConversation: (state, action: Payload.Connect) => {
      const { activeUserIds, conversation: convo } = action.payload;

      const isGroup = Convo.isGroup(convo);
      const participants = Object.fromEntries(
        convo.participants.map((user) => [user.id, user])
      );

      state.entities[convo.id] = {
        ...convo,
        ...initialChatSocketEntity,
        activeUserIds,
        participants,
        isGroup,
      };
    },

    addActiveUser: (state, action: Payload.JoinChat) => {
      const { id: userId, conversationId: convoId } = action.payload;

      const entity = state.entities[convoId];
      if (!entity) return;

      entity.activeUserIds = [...entity.activeUserIds, userId];
    },

    removeActiveUser: (state, action: Payload.LeaveChat) => {
      const { id: userId, conversationId: convoId } = action.payload;

      const entity = state.entities[convoId];
      if (!entity) return;

      entity.activeUserIds = entity.activeUserIds.filter((id) => id !== userId);
    },

    pendMessage: (state, action: Payload.Message.Pending) => {
      const { conversationId: convoId, content, at } = action.payload;

      const entity = state.entities[convoId];
      if (!entity) return;

      entity.messages = [
        ...entity.messages,
        { ...initialMessage, content, at },
      ];
    },

    unpendMessage: (state, action: Payload.Message.SendSuccess) => {
      const { conversationId: convoId, ...updatedMessage } = action.payload;

      const entity = state.entities[convoId];
      if (!entity) return;

      // update pending message
      entity.messages = entity.messages.filter(
        (msg) => msg.id !== updatedMessage.id
      );
    },

    addMessage: (state, action: Payload.Message.Receive) => {
      const { conversationId: convoId, ...message } = action.payload;

      const entity = state.entities[convoId];
      if (!entity) return;

      entity.messages = [...entity.messages, message];
    },

    deleteMessage: (state, action: Payload.Message.DeleteNotify) => {
      const { conversationId: convoId, id: messageId } = action.payload;

      const entity = state.entities[convoId];
      if (!entity) return;

      entity.messages = entity.messages.filter((msg) => msg.id !== messageId);
    },

    updateMessage: (state, action: Payload.Message.UpdateNotify) => {
      const { conversationId: convoId, ...message } = action.payload;

      const entity = state.entities[convoId];
      if (!entity) return;

      const messageId = entity.messages.findIndex((m) => m.id === message.id);
      if (messageId === -1) return;

      entity.messages[messageId] = message;
    },
  },
});

export const chatSocketReducer = chatSocketSlice.reducer;
export const chatSocketActions = chatSocketSlice.actions;

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
