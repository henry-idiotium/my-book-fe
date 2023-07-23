import { AppDispatch, chatSocketActions as actions } from '@/stores';
import { ChatSocket, ChatSocketListener as Listener } from '@/types';

import { computeToChatSocketState } from './compute-to-chat-socket-state';

import UserEvents = Listener.User.Events;
import MessageEvents = Listener.Message.Events;

type InitListenersArgs = [
  conversationId: string,
  socket: ChatSocket,
  sessionUserId: number,
  dispatch: AppDispatch,
];

export function initChatSocketListeners(...args: InitListenersArgs) {
  const [conversationId, socket, sessionUserId, dispatch] = args;

  const withConvo = <T>(p: T) => Object.assign({}, { conversationId, ...p });

  /** Init conversation socket state. */
  socket.on(UserEvents.CONNECT, ({ conversation, activeUserIds }) => {
    const chatSocketState = computeToChatSocketState(conversation, activeUserIds, sessionUserId);
    dispatch(actions.set(chatSocketState));
  });

  if (import.meta.env.DEV) {
    socket.on('connect_error', console.error);
    socket.on(Listener.Server.Events.EXCEPTION, console.error);
  }

  /** Active user changes listeners. */
  socket.on(UserEvents.JOIN_CHAT, (payload) => {
    dispatch(actions.addActiveUser(withConvo(payload)));
  });
  socket.on(UserEvents.LEAVE_CHAT, (payload) => {
    dispatch(actions.removeActiveUser(withConvo(payload)));
  });

  /** Message changes listeners. */
  socket.on(MessageEvents.READ_RECEIPT, (payload) => {
    dispatch(actions.updateMessageSeenLog(withConvo(payload)));
  });
  socket.on(MessageEvents.RECEIVE, (payload) => {
    dispatch(actions.addMessage(withConvo(payload)));
  });
  socket.on(MessageEvents.DELETE_NOTIFY, (payload) => {
    dispatch(actions.deleteMessage(withConvo(payload)));
  });
  socket.on(MessageEvents.UPDATE_NOTIFY, (payload) => {
    dispatch(actions.updateFullMessage(withConvo(payload)));
  });
}
