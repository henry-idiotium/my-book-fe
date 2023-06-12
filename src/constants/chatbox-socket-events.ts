const common = {
  ADD_ROOM: 'add_room',
  MESSAGE_PENDING: 'message_pending',
} as const;

export const socketEmitEvents = {
  SOCKET_MESSAGE_SENT: 'socket_message_sent',
  SOCKET_MESSAGE_UPDATING: 'socket_message_updating',
  SOCKET_MESSAGE_DELETING: 'socket_message_deleting',
} as const;

export const socketListenEvents = {
  SOCKET_USER_JOINED: 'socket_user_joined',
  SOCKET_USER_CONNECTED: 'socket_user_connected',
  SOCKET_USER_DISCONNECTED: 'socket_user_disconnected',
  SOCKET_MESSAGE_RECEIVED: 'socket_message_received',
  SOCKET_MESSAGE_UPDATED: 'socket_message_updated',
  SOCKET_MESSAGE_DELETED: 'socket_message_deleted',
} as const;

const conversation = {} as const;

const conversationGroup = {} as const;

export const actions = {
  ...common,
  ...socketEmitEvents,
  ...socketListenEvents,
  ...conversation,
  ...conversationGroup,
} as const;
