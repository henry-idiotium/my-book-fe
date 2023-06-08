import { Socket, io } from 'socket.io-client';
import { z } from 'zod';

import actions from './actions';

import {
  UserDisconnectedPayload,
  MessageReceivedPayload,
  UserJoinedPayload,
  MessageEntity,
  UserConnectedPayload,
  messageZod,
  conversationZod,
  conversationGroupZod,
  MessageSentPayload,
} from '@/types';

const {
  MESSAGE_PENDING,
  MESSAGE_RECEIVED,
  SOCKET_MESSAGE_RECEIVED,
  SOCKET_MESSAGE_SENT,
  SOCKET_USER_CONNECTED,
  SOCKET_USER_DISCONNECTED,
  SOCKET_USER_JOINED,
} = actions;

type SocketAction = typeof actions;

type PayloadMap = {
  [SOCKET_USER_DISCONNECTED]: UserDisconnectedPayload;
  [SOCKET_MESSAGE_RECEIVED]: MessageReceivedPayload;
  [SOCKET_MESSAGE_SENT]: MessageSentPayload;
  [SOCKET_USER_JOINED]: UserJoinedPayload;
  [MESSAGE_RECEIVED]: MessageEntity[];
  [MESSAGE_PENDING]: string | undefined;
  [SOCKET_USER_CONNECTED]: {
    eventPayload: UserConnectedPayload;
    socket: Socket;
    isGroup: boolean;
  };
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
  userIds: z.set(z.number()).default(new Set<number>()),
  messages: z.array(messageZod),
  messagePending: z.string().optional(),
  socket: z
    .custom<Socket<ClientToServerEvents, ServerToClientEvents>>()
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

type HandleEvent = GenericObject & {
  [Key in keyof SocketAction]: {
    [K in Key extends string
      ? SocketAction[Key]
      : never]: SocketAction[Key] extends keyof PayloadMap
      ? (args: PayloadMap[SocketAction[Key]]) => void
      : never;
  };
};

// emit
export type ServerToClientEvents = HandleEvent['SOCKET_MESSAGE_SENT'];
// on event
export type ClientToServerEvents = HandleEvent['SOCKET_MESSAGE_RECEIVED'];
