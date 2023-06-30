/* eslint-disable @typescript-eslint/no-namespace */
import { io } from 'socket.io-client';

import { handshakeQueryZod } from './types/handshake-query';

import { ChatSocket } from '@/types';

const socketAddress = `${import.meta.env.VITE_SERVER_URL}/conversations`;

export namespace ChatSocketMap {
  export const store = new Map<string, ChatSocket>();

  type ConnectArgs = [id: string, token: string];

  /** Connect socket to the backend then immediately add to the Map. */
  export function connect(...[id, token]: ConnectArgs) {
    const socket = io(socketAddress, {
      query: handshakeQueryZod.parse({ conversationId: id }),
      extraHeaders: { Authorization: token },
    });
    store.set(id, socket);
    return socket;
  }

  /** Get current chat socket. Create new if not found. */
  export function getOrConnect(...[id, token]: ConnectArgs) {
    const existsSocket = store.get(id);
    const socket = existsSocket ?? connect(id, token);
    if (!existsSocket) store.set(id, socket);
    return socket;
  }
}

export default ChatSocketMap;
