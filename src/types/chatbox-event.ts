import { Socket } from 'socket.io-client';

import { MessagePayload, UserPayload } from './socket-event-payload';

export const socketEmitEvents = {
  messageSent: {
    name: 'socket_message_sent',
    type: {} as MessagePayload.Sent,
  },
  messageUpdating: {
    name: 'socket_message_updating',
    type: {} as MessagePayload.Updating,
  },
  messageDeleting: {
    name: 'socket_message_deleting',
    type: {} as MessagePayload.Deleting,
  },
} as const;

export const socketListenEvents = {
  messageReceived: {
    name: 'socket_message_received',
    type: {} as MessagePayload.Received,
  },
  userJoined: {
    name: 'socket_user_joined',
    type: {} as UserPayload.Joined,
  },
  userConnected: {
    name: 'socket_user_connected',
    type: {} as UserPayload.Connected,
  },
  userDisconnected: {
    name: 'socket_user_disconnected',
    type: {} as UserPayload.Disconnected,
  },
  messageUpdated: {
    name: 'socket_message_updated',
    type: {} as MessagePayload.Updated,
  },
  messageDeleted: {
    name: 'socket_message_deleted',
    type: {} as MessagePayload.Deleted,
  },
} as const;

export const chatboxEvents = {
  ...socketEmitEvents,
  ...socketListenEvents,
} as const;

export type GetEventType<TEvent extends keyof typeof chatboxEvents> =
  (typeof chatboxEvents)[TEvent]['type'];

type HandleEvent<TEvent extends keyof typeof chatboxEvents> = {
  [Key in (typeof chatboxEvents)[TEvent] as Key['name']]: (
    args: Key['type']
  ) => void;
};

// listener
export type ServerToClientEvents = HandleEvent<keyof typeof socketListenEvents>;
// emitter
export type ClientToServerEvents = HandleEvent<keyof typeof socketEmitEvents>;

export type ChatboxSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
