import { Socket } from 'socket.io-client';

import Payload from './chat-socket-payload';

// ----------------
// constants
export const chatSocketEmitEvents = {
  messageSent: {
    name: 'socket_message_sent',
    type: {} as Payload.Message.Sent,
  },
  messageUpdating: {
    name: 'socket_message_updating',
    type: {} as Payload.Message.Updating,
  },
  messageDeleting: {
    name: 'socket_message_deleting',
    type: {} as Payload.Message.Deleting,
  },
} as const;

export const chatSocketListenEvents = {
  exception: {
    name: 'exception',
    type: {} as { name: string; message: string; stack?: string },
  },
  messageReceived: {
    name: 'socket_message_received',
    type: {} as Payload.Message.Received,
  },
  userJoined: {
    name: 'socket_user_joined',
    type: {} as Payload.User.Joined,
  },
  userConnected: {
    name: 'socket_user_connected',
    type: {} as Payload.User.Connected,
  },
  userDisconnected: {
    name: 'socket_user_disconnected',
    type: {} as Payload.User.Disconnected,
  },
  messageUpdated: {
    name: 'socket_message_updated',
    type: {} as Payload.Message.Updated,
  },
  messageDeleted: {
    name: 'socket_message_deleted',
    type: {} as Payload.Message.Deleted,
  },
} as const;

export const chatSocketEvents = {
  ...chatSocketEmitEvents,
  ...chatSocketListenEvents,
} as const;

// ----------------
// types
export type ChatSocket = Socket<
  ExtractEventsByKey<keyof typeof chatSocketListenEvents>, // listeners
  ExtractEventsByKey<keyof typeof chatSocketEmitEvents> // emitters
>;

// util types
export type GetEventType<TKey extends keyof ChatEvents> =
  ChatEvents[TKey]['type'];

// helpers
type ChatEvents = typeof chatSocketEvents;
type ExtractEventsByKey<TEvent extends keyof ChatEvents> = {
  [Key in ChatEvents[TEvent] as Key['name']]: (args: Key['type']) => void;
};
