import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

import {
  ChatSocketEmitter as Emitter,
  ChatSocketListener as Listener,
  messageZod,
} from '@/types';
import { Convo, getZodDefault } from '@/utils';

import { RootState } from '../app-store';

import * as ChatSocketMap from './chat-socket.map';
import { ChatSocketEntity, ChatSocketSlicePayloads as Payloads } from './types';

import UserListener = Listener.User.Events;
import MessageListener = Listener.Message.Events;
import MessageEmitter = Emitter.Message.Events;

export const CHAT_SOCKET_FEATURE_KEY = 'chat-socket';

const adapter = createEntityAdapter<ChatSocketEntity>({
  selectId: ({ id }) => id,
});

const initialState = adapter.getInitialState();

export const chatSocketSlice = createSlice({
  name: CHAT_SOCKET_FEATURE_KEY,
  initialState,
  reducers: {
    startConnection(state, action: Payloads.User.InitConversation) {
      const { conversationId, token } = action.payload;

      const socket = ChatSocketMap.getOrConnect(conversationId, token);
      if (!socket?.connected) return;

      // Handle conversation connection from main user.
      socket.on(UserListener.CONNECT, ({ activeUserIds, conversation }) => {
        // add convo to current Set
        adapter.setOne(state, {
          ...conversation,
          activeUserIds,
          isGroup: Convo.isGroup(conversation),
        });

        console.log(state);

        // terminate listen convo connect after callback is run
        socket.off(UserListener.CONNECT);

        // active users changes
        socket.on(UserListener.JOIN_CHAT, ({ activeUserIds }) =>
          adapter.updateOne(state, {
            id: conversationId,
            changes: { activeUserIds },
          }),
        );
        socket.on(UserListener.LEAVE_CHAT, ({ activeUserIds }) =>
          adapter.updateOne(state, {
            id: conversationId,
            changes: { activeUserIds },
          }),
        );
      });

      // Handle message updates from other users.
      socket.on(MessageListener.UPDATE_NOTIFY, (payload) => {
        const entity = state.entities[conversationId];
        if (!entity) return;

        const updatedMessageIndex = entity.messages.findIndex(
          (m) => m.id === payload.id,
        );
        if (updatedMessageIndex === -1) return;
        entity.messages[updatedMessageIndex] = payload;
      });

      // Handle message deletions from other users.
      socket.on(MessageListener.DELETE_NOTIFY, (payload) => {
        const entity = state.entities[conversationId];
        if (!entity) return;

        const deletedMessageIndex = entity.messages.findIndex(
          (m) => m.id === payload.id,
        );
        if (deletedMessageIndex === -1) return;

        entity.messages.splice(deletedMessageIndex, 1);
      });

      // server exception
      if (import.meta.env.DEV) {
        socket.on(Listener.EXCEPTION, (err) => console.error(err));
      }
    },

    disposeConnection(state, action: Payloads.User.DisposeConnection) {
      const { conversationId, token } = action.payload;

      const socket = ChatSocketMap.getOrConnect(conversationId, token);
      if (!socket?.connected) return;

      socket.off();
      ChatSocketMap.store.delete(conversationId);
    },

    // ----------------
    // emit events

    sendMessage(state, action: Payloads.Message.Send) {
      const { conversationId, content } = action.payload;

      const socket = ChatSocketMap.store.get(conversationId);
      if (!socket?.connected) return;

      const entity = state.entities[conversationId];
      if (!entity) return;

      const newMessage = {
        ...getZodDefault(messageZod),
        at: new Date(), // identifier for pending state
        content,
      };

      // remarks: add newly created message with empty ID as `pending` status
      entity.messages.push(newMessage);

      socket.emit(MessageEmitter.SEND, newMessage);
    },

    updateMessage(state, action: Payloads.Message.Update) {
      const { conversationId, content, id } = action.payload;

      const socket = ChatSocketMap.store.get(conversationId);
      if (!socket?.connected) return;

      const entity = state.entities[conversationId];
      if (!entity) return;

      const index = entity.messages.findIndex((m) => m.id === id);
      if (index === -1) return;

      entity.messages[index] = {
        ...entity.messages[index],
        isEdited: true,
        content,
      };

      socket.emit(MessageEmitter.UPDATE, entity.messages[index]);
    },

    deleteMessage(state, action: Payloads.Message.Delete) {
      const { conversationId, id } = action.payload;

      const socket = ChatSocketMap.store.get(conversationId);
      if (!socket?.connected) return;

      const entity = state.entities[conversationId];
      if (!entity) return;

      const index = entity.messages.findIndex((m) => m.id === id);
      if (index === -1) return;

      entity.messages.splice(index, 1);
      socket.emit(MessageEmitter.DELETE, { id });
    },

    seenMessage(state, action: Payloads.Message.Seen) {
      const { conversationId, id, userId } = action.payload;

      const socket = ChatSocketMap.store.get(conversationId);
      if (!socket?.connected) return;

      const entity = state.entities[conversationId];
      if (!entity) return;

      const index = entity.messageSeenLog.findIndex((m) => m.userId === userId);
      if (index === -1) return;

      // entity.messageSeenLog[index] = {
      //   ...entity.messageSeenLog[index],
      //   messageId: id,
      // };
      entity.messageSeenLog[index].messageId = id;
      socket.emit(MessageEmitter.SEEN, { id });
    },
  },
});

export { ChatSocketMap };

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
