// import { EXCEPTION, Exception } from './exception';
import * as Message from './message';
import * as User from './user';

import { MapEventPayloadActions } from '@/types/socket-helper';

const EXCEPTION = 'exception';
type Exception = { name: string; message: string; stack?: string };

export type ChatSocketListenEvents = MapEventPayloadActions<{
  [User.Events.CONNECT]: User.Payloads.Connect;
  [User.Events.JOIN_CHAT]: User.Payloads.JoinChat;
  [User.Events.LEAVE_CHAT]: User.Payloads.LeaveChat;

  [Message.Events.SEND_SUCCESS]: Message.Payloads.SendSuccess;
  [Message.Events.RECEIVE]: Message.Payloads.Receive;
  [Message.Events.READ_RECEIPT]: Message.Payloads.ReadReceipt;
  [Message.Events.DELETE_NOTIFY]: Message.Payloads.DeleteNotify;
  [Message.Events.DELETE_SUCCESS]: Message.Payloads.DeleteSuccess;
  [Message.Events.UPDATE_NOTIFY]: Message.Payloads.UpdateNotify;
  [Message.Events.UPDATE_SUCCESS]: Message.Payloads.UpdateSuccess;

  [EXCEPTION]: Exception;
}>;

export { EXCEPTION, Exception, Message, User };
