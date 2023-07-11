import { MapEventPayloadActions } from '@/types/socket-helper';

import * as Message from './message';
import * as Server from './server';
import * as User from './user';

export type ChatSocketListenEvents = MapEventPayloadActions<{
  [Server.Events.EXCEPTION]: Server.Payloads.Exception;

  [User.Events.CONNECT]: User.Payloads.Connect;
  [User.Events.JOIN_CHAT]: User.Payloads.JoinChat;
  [User.Events.LEAVE_CHAT]: User.Payloads.LeaveChat;

  [Message.Events.SEND_SUCCESS]: Message.Payloads.SendSuccess;
  [Message.Events.SEND_FAILURE]: Message.Payloads.SendFailure;
  [Message.Events.RECEIVE]: Message.Payloads.Receive;
  [Message.Events.READ_RECEIPT]: Message.Payloads.ReadReceipt;
  [Message.Events.DELETE_NOTIFY]: Message.Payloads.DeleteNotify;
  [Message.Events.DELETE_FAILURE]: Message.Payloads.DeleteFailure;
  [Message.Events.UPDATE_NOTIFY]: Message.Payloads.UpdateNotify;
  [Message.Events.UPDATE_FAILURE]: Message.Payloads.UpdateFailure;
}>;

export { Server, Message, User };
