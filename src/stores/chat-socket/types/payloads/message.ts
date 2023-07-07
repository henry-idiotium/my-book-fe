import { ChatSocketListener, ChatSocketEmitter } from '@/types';

import { ConvoWrap } from './helpers';

import Listener = ChatSocketListener.Message.Payloads;
import Emitter = ChatSocketEmitter.Message.Payloads;

export type Pending = ConvoWrap<Emitter.Send>;

export type SendSuccess = ConvoWrap<Listener.SendSuccess>;

export type Receive = ConvoWrap<Listener.Receive>;

export type ReadReceipt = ConvoWrap<Listener.ReadReceipt>;

export type DeleteNotify = ConvoWrap<Listener.DeleteNotify>;
export type DeleteSuccess = ConvoWrap<Listener.DeleteSuccess>;

export type UpdateNotify = ConvoWrap<Listener.UpdateNotify>;
export type UpdateSuccess = ConvoWrap<Listener.UpdateSuccess>;
