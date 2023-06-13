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

type EventUnion = typeof socketEmitEvents | typeof socketListenEvents;

type ExtractValues<T extends EventUnion> = T[keyof T] extends {
  name: string;
  type: unknown;
}
  ? T[keyof T]
  : never;

type HandleEvents<T extends EventUnion> = {
  [Key in ExtractValues<T> as Key['name']]: (payload: Key['type']) => void;
};

export type ChatboxEmitEvents = HandleEvents<typeof socketEmitEvents>;
export type ChatboxListenEvents = HandleEvents<typeof socketListenEvents>;
