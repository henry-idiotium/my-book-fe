import { Socket, io } from 'socket.io-client';
import { z } from 'zod';

import actions, { socketEmitEvents, socketListenEvents } from './actions';

import {
  MessageDeletingPayload,
  MessageEntity,
  MessageSentPayload,
  MessageUpdatedPayload,
  MessageUpdatingPayload,
  MinimalUserEntity,
  UserConnectedPayload,
  UserDisconnectedPayload,
  UserJoinedPayload,
  conversationGroupZod,
  conversationZod,
  messageZod,
  minimalUserZod,
} from '@/types';

const {
  MESSAGE_PENDING,
  SOCKET_MESSAGE_RECEIVED,
  SOCKET_MESSAGE_SENT,
  SOCKET_USER_CONNECTED,
  SOCKET_USER_DISCONNECTED,
  SOCKET_USER_JOINED,
  SOCKET_MESSAGE_DELETED,
  SOCKET_MESSAGE_DELETING,
  SOCKET_MESSAGE_UPDATED,
  SOCKET_MESSAGE_UPDATING,
  INIT,
} = actions;

type SocketAction = typeof actions;

type PayloadMap = {
  [INIT]: ChatboxSocketContextState;
  [SOCKET_USER_DISCONNECTED]: UserDisconnectedPayload;
  [SOCKET_MESSAGE_RECEIVED]: MessageEntity;
  [SOCKET_MESSAGE_SENT]: MessageSentPayload;
  [SOCKET_USER_JOINED]: UserJoinedPayload;
  [MESSAGE_PENDING]: string | undefined;
  [SOCKET_USER_CONNECTED]: UserConnectedPayload;
  [SOCKET_MESSAGE_DELETING]: MessageDeletingPayload;
  [SOCKET_MESSAGE_DELETED]: { id: string };
  [SOCKET_MESSAGE_UPDATED]: MessageUpdatedPayload;
  [SOCKET_MESSAGE_UPDATING]: MessageUpdatingPayload;
};
export type ChatboxSocketContextDispatch = {
  [Key in keyof SocketAction]: {
    type: SocketAction[Key];
    payload: SocketAction[Key] extends keyof PayloadMap
      ? PayloadMap[SocketAction[Key]]
      : unknown;
  };
}[keyof SocketAction];

export const chatboxSocketContextStateZod = z.object({
  userCount: z.number(),
  users: z
    .map(z.number(), minimalUserZod)
    .default(new Map<number, MinimalUserEntity>()),
  messages: z.array(messageZod),
  messagePending: z.string().optional(),
  socket: z
    .custom<Socket<ServerToClientEvents, ClientToServerEvents>>()
    .default(io({ autoConnect: false })),
  conversation: conversationZod,
  conversationGroup: conversationGroupZod,
});

export type ChatboxSocketContextState = z.infer<
  typeof chatboxSocketContextStateZod
>;

export type ChatboxSocketContext = {
  socketState: ChatboxSocketContextState;
  socketDispatch: React.Dispatch<ChatboxSocketContextDispatch>;
};

type HandleEvent<T extends Record<keyof T, keyof PayloadMap>> = {
  [Key in keyof T as T[Key]]: (args: PayloadMap[T[Key]]) => void;
};

// emitter
export type ServerToClientEvents = HandleEvent<typeof socketListenEvents>;
// listener
export type ClientToServerEvents = HandleEvent<typeof socketEmitEvents>;
