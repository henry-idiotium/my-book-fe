/* eslint-disable @typescript-eslint/no-namespace */
import { io } from 'socket.io-client';

import { ChatSocket } from '@/types';

export namespace ChatSocketRecord {
  export const record: GenericObject<ChatSocket | undefined> = {};

  /**
   * Connect user to chat socket
   */
  export function connect(id: string, token: string) {
    return io(`${import.meta.env.VITE_SERVER_URL}/chatbox`, {
      query: { chatboxId: id },
      extraHeaders: { Authorization: token },
    });
  }

  /**
   * Get or connect the current user to chat socket
   */
  export function getOrConnect(id: string, token: string) {
    const existsSocket = get(id);

    let socket: ChatSocket;
    if (existsSocket) socket = existsSocket;
    else {
      socket = connect(id, token);
      record[id] = socket;
    }

    return socket;
  }

  /**
   * Get chat socket in the record.
   */
  export function get(id: string) {
    const socket = record[id];
    return socket;
  }

  /**
   * Delete specify chat socket in the record.
   */
  export function remove(id: string) {
    return delete record[id];
  }
}

export default ChatSocketRecord;
