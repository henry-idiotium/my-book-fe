import {
  EntityState,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

import { RootState } from '../app-store';

import Payload from './chat-socket.slice.types';

import { ChatSocket, ChatSocketEntity, initialChatSocketEntity } from '@/types';
import { Convo } from '@/utils';

export const chatSocketRecord: GenericObject<ChatSocket> = {};

export const CHAT_SOCKET_FEATURE_KEY = 'chat-socket';

const adapter = createEntityAdapter<ChatSocketEntity>();
const initialState: EntityState<ChatSocketEntity> = adapter.getInitialState();

// note: debug to see if this works or not
// also, remember to delete all unecessary comments
const chatSlice = createSlice({
  name: CHAT_SOCKET_FEATURE_KEY,
  initialState,
  reducers: {
    userConnected: (state, action: Payload.User.Connected) => {
      const { chatbox, userActiveCount } = action.payload;

      // clear messages in chatbox, and let the opened socket to store it
      const messages = structuredClone(chatbox.messages ?? []);
      delete chatbox.messages;

      // pair/group filters
      const users = Object.fromEntries(
        !Convo.isGroup(chatbox)
          ? chatbox.conversationBetween.map((user) => [user.id, user])
          : chatbox.members?.map((user) => [user.id, user]) ?? []
      );
      const convo: Partial<ChatSocketEntity> = Convo.isGroup(chatbox)
        ? { conversationGroup: chatbox }
        : { conversation: chatbox };

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

      // remove user
      delete entity.users[userId];
      entity.userActiveCount -= 1;

      // update state
      state.entities[convoId] = entity;
    },
    userJoined: (state, action: Payload.User.Joined) => {
      const { userActiveCount, userJoinedId, convoId } = action.payload;

      const entity = state.entities[convoId];
      if (!entity) return;

      const activeUser = entity.users[userJoinedId];
      if (!activeUser || !activeUser.metadata) return;

      activeUser.metadata.isActive = true;
      entity.userActiveCount = userActiveCount;

      // entity.users[userJoinedId] = activeUser;
      // state.entities[convoId] = {
      //   ...entity,
      //   userActiveCount,
      // };
    },
    messageReceived: (state, action: Payload.Message.Received) => {
      const { convoId, ...message } = action.payload;

      const entity = state.entities[convoId];
      if (!entity) return;

      entity.messages = [message, ...entity.messages];
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

      entity.messages = entity.messages.map((msg) =>
        msg.id === id ? { ...msg, content: null } : msg
      );
    },
    messageUpdated: (state, action: Payload.Message.Updated) => {
      const { convoId, id, content } = action.payload;

      const entity = state.entities[convoId];
      if (!entity) return;

      entity.messages = entity.messages.map((e) => {
        if (e.id === id) return { ...e, content: content, isEdited: true };
        return e;
      });
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
