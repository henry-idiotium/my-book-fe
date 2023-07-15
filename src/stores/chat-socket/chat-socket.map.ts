import { io } from 'socket.io-client';

import { ChatSocket } from '@/types';

import { handshakeQueryZod } from './types/handshake-query';

const URL = `${import.meta.env.VITE_SERVER_CONVERSATION_URL}/conversations`;
const TIMEOUT = 5000;

export const store = new Map<string, ChatSocket>();

/** Connect socket to the backend then immediately add to the Map. */
export function connect(conversationId: string, token: string): ChatSocket {
  const socket = io(URL, {
    query: handshakeQueryZod.parse({ conversationId: conversationId }),
    extraHeaders: { Authorization: token },
    timeout: TIMEOUT,
  });

  store.set(conversationId, socket);

  return socket;
}

/** Get current chat socket. Connect new if not found. */
export function ensureGet(conversationId: string, token: string) {
  return store.get(conversationId) ?? connect(conversationId, token);
}

export function disconnect(conversationId: string): void {
  const socket = store.get(conversationId);
  if (!socket) return;

  // remove listeners and close.
  socket.off().close();
  // delete the socket instance from the store.
  store.delete(conversationId);
}
