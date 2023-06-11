const common = {
  MESSAGE_PENDING: 'message_pending',
  INIT: 'init',
} as const;

export const socketEmitEvents = {
  SOCKET_MESSAGE_SENT: 'socket_message_sent',
  SOCKET_MESSAGE_UPDATING: 'socket_message_updating',
  SOCKET_MESSAGE_DELETING: 'socket_message_deleting',
} as const;

export const socketListenEvents = {
  SOCKET_MESSAGE_RECEIVED: 'socket_message_received',
  SOCKET_USER_JOINED: 'socket_user_joined',
  SOCKET_USER_CONNECTED: 'socket_user_connected',
  SOCKET_USER_DISCONNECTED: 'socket_user_disconnected',
  SOCKET_MESSAGE_UPDATED: 'socket_message_updated',
  SOCKET_MESSAGE_DELETED: 'socket_message_deleted',
} as const;

const conversation = {} as const;

const conversationGroup = {} as const;

const actions = {
  ...common,
  ...socketEmitEvents,
  ...socketListenEvents,
  ...conversation,
  ...conversationGroup,
} as const;

export default actions;
