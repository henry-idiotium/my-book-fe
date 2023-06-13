import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { RootState } from '../app-store';

import {
  MessageDeleted,
  MessagePending,
  MessageReceived,
  MessageUpdated,
  UserConnected,
  UserDisconnected,
  UserJoined,
} from './convo.type';

import { initialSocketState } from '@/pages/messages/components/socket-context-provider/context';
import {
  ChatboxSocket,
  ChatboxSocketContextState,
} from '@/pages/messages/components/socket-context-provider/types';
import { Convo } from '@/utils';

export const socketMap = new Map<string, ChatboxSocket>();
export const CONVO_FEATURE_KEY = 'chatboxSockets';

const initialState = new Map<string, ChatboxSocketContextState>();

const convoSlice = createSlice({
  name: CONVO_FEATURE_KEY,
  initialState,
  reducers: {
    userConnected: (state, action: PayloadAction<UserConnected>) => {
      const { chatbox, socket, userCount } = action.payload;

      const messages = structuredClone(chatbox.messages ?? []);
      delete chatbox.messages;

      const users = new Map(
        !Convo.isGroup(chatbox)
          ? chatbox.conversationBetween.map((user) => [user.id, user])
          : chatbox.members?.map((user) => [user.id, user]) ?? []
      );

      const convo: Partial<ChatboxSocketContextState> = Convo.isGroup(chatbox)
        ? { conversationGroup: chatbox }
        : { conversation: chatbox };

      const oldState = state.get(chatbox.id) ?? initialSocketState;
      const newState = { ...oldState, ...convo, messages, users, userCount };
      state.set(chatbox.id, newState);

      socketMap.set(chatbox.id, socket);
    },
    userDisconnected: (state, action: PayloadAction<UserDisconnected>) => {
      const { userId, chatboxId } = action.payload;
      const oldState = state.get(chatboxId);
      if (!oldState) return;

      oldState.users.delete(userId);
      state.set(chatboxId, {
        ...oldState,
        userCount: oldState.userCount - 1,
      });
    },
    userJoined: (state, action: PayloadAction<UserJoined>) => {
      const { userCount, userJoinedId, chatboxId } = action.payload;
      const oldState = state.get(chatboxId);
      if (!oldState) return;

      const activeUser = oldState.users.get(userJoinedId);
      if (!activeUser || !activeUser.metadata) return;

      activeUser.metadata.isActive = true;
      oldState.users.set(userJoinedId, activeUser);

      state.set(chatboxId, {
        ...oldState,
        userCount,
      });
    },
    messageReceive: (state, action: PayloadAction<MessageReceived>) => {
      const { chatboxId, ...message } = action.payload;
      const oldState = state.get(chatboxId);
      if (!oldState) return;

      oldState.messages.push(message);
      state.set(chatboxId, { ...oldState, messagePending: undefined });
    },
    messagePending: (state, action: PayloadAction<MessagePending>) => {
      const { chatboxId, content } = action.payload;
      const oldState = state.get(chatboxId);
      if (!oldState) return;

      state.set(chatboxId, { ...oldState, messagePending: content });
    },
    messageDeleted: (state, action: PayloadAction<MessageDeleted>) => {
      const { chatboxId, id } = action.payload;
      const oldState = state.get(chatboxId);
      if (!oldState) return;

      state.set(chatboxId, {
        ...oldState,
        messages: oldState.messages.map((e) => {
          if (e.id === id) return { ...e, content: null };
          return e;
        }),
      });
    },
    messageUpdated: (state, action: PayloadAction<MessageUpdated>) => {
      const { chatboxId, id, content } = action.payload;
      const oldState = state.get(chatboxId);
      if (!oldState) return;

      state.set(chatboxId, {
        ...oldState,
        messages: oldState.messages.map((e) => {
          if (e.id === id) return { ...e, content: content, isEdited: true };
          return e;
        }),
      });
    },
  },
});

export const convoReducer = convoSlice.reducer;
export const {
  messageDeleted,
  messagePending,
  messageReceive,
  messageUpdated,
  userConnected,
  userDisconnected,
  userJoined,
} = convoSlice.actions;
export const selectConvo = (state: RootState) => state[CONVO_FEATURE_KEY];
export const selectConvoById = (convoId: string) => (state: RootState) =>
  state[CONVO_FEATURE_KEY].get(convoId);
