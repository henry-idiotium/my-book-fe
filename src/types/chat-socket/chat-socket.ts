import { Socket } from 'socket.io-client';

import Emitter from './chat-socket-emitter';
import Listener from './chat-socket-listener';

export type ChatSocket = Socket<Listener.Events, Emitter.Events>;
export default ChatSocket;
