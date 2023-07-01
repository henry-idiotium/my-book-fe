import { Socket } from 'socket.io-client';

import { ChatSocketEmitEvents as EmitEvents } from './emitter';
import { ChatSocketListenEvents as ListenEvents } from './listener';

export type ChatSocket = Socket<ListenEvents, EmitEvents>;
export default ChatSocket;
