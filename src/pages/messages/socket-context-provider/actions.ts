const common = {
  MESSAGE_RECEIVED: 'message_received',
  MESSAGE_PENDING: 'message_pending',
} as const;

export const socketEmit = {
  SOCKET_MESSAGE_SENT: 'socket_message_sent',
} as const;

export const socketOn = {
  SOCKET_MESSAGE_RECEIVED: 'socket_message_received',
  SOCKET_USER_JOINED: 'socket_user_joined',
  SOCKET_USER_CONNECTED: 'socket_user_connected',
  SOCKET_USER_DISCONNECTED: 'socket_user_disconnected',
} as const;

const conversation = {} as const;

const conversationGroup = {} as const;

const actions = {
  ...common,
  ...socketEmit,
  ...socketOn,
  ...conversation,
  ...conversationGroup,
} as const;

export default actions;
