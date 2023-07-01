/* eslint-disable @typescript-eslint/no-namespace */
import { io } from 'socket.io-client';

import { handshakeQueryZod } from './types/handshake-query';

import { ChatSocket } from '@/types';

const socketAddress = `${import.meta.env.VITE_SERVER_CHAT_URL}/conversations`;

export namespace ChatSocketMap {
  export const store = new Map<string, ChatSocket>();

  /** Connect socket to the backend then immediately add to the Map. */
  export function connect(id: string, token: string) {
    const socket = io(socketAddress, {
      query: handshakeQueryZod.parse({ conversationId: id }),
      extraHeaders: { Authorization: token },
    });
    store.set(id, socket);
    return socket;
  }

  /** Get current chat socket. Create new if not found. */
  export function getOrConnect(id: string, token: string) {
    const existsSocket = store.get(id);
    const socket = existsSocket ?? connect(id, token);
    if (!existsSocket) store.set(id, socket);
    return socket;
  }
}

export default ChatSocketMap;
