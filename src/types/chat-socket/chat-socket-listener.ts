/* eslint-disable @typescript-eslint/no-namespace */
import { ConversationEntity } from '../conversations';
import { MessageEntity } from '../conversations/message';
import Helper from '../socket-helper';
import { MinimalUserEntity } from '../user';

export declare namespace ChatSocketListener {
  namespace User {
    /** Connect to the server successfully. */
    const CONNECT = 'user_connect';
    type Connect = Util.User.ActiveUserPayload & {
      conversation: ConversationEntity;
    };

    /** A new user join a conversation. */
    const JOIN_CHAT = 'user_join_chat';
    type JoinChat = Util.User.WithKeys<'id'>;

    /** A user leave a conversation. */
    const LEAVE_CHAT = 'user_leave_chat';
    type LeaveChat = Util.User.WithKeys<'id'>;
  }

  namespace Message {
    /** When other clients has seen sent message. */
    const READ_RECEIPT = 'message_read_receipt';
    type ReadReceipt = Util.Message.WithKeys<'id'>;

    /** When a new message is sent by others. */
    const RECEIVE = 'message_receive';
    type Receive = Util.Message.Payload;

    /** When a message is successfully sent. */
    const SEND_SUCCESS = 'message_send_success';
    type SendSuccess = Util.Message.Payload;

    /** When a message is successfully updated. */
    const UPDATE_SUCCESS = 'message_update_success';
    type UpdateSuccess = Util.Message.Payload;

    /** When others update their message. */
    const UPDATE_NOTIFY = 'message_update_notify';
    type UpdateNotify = Util.Message.Payload;

    /** When a message is successfully deleted. */
    const DELETE_SUCCESS = 'message_delete_success';
    type DeleteSuccess = Util.Message.WithKeys<'id'>;

    /** When others delete their message. */
    const DELETE_NOTIFY = 'message_delete_notify';
    type DeleteNotify = Util.Message.WithKeys<'id'>;
  }

  /** When other clients has seen sent message. */
  const EXCEPTION = 'exception';
  type Exception = { name: string; message: string; stack?: string };

  /**
   * Event types map between socket event key and theircorresponding
   * payload types.
   */
  type Events = Helper.MapEventPayloadActions<{
    [User.CONNECT]: User.Connect;

    [User.JOIN_CHAT]: User.JoinChat;
    [User.LEAVE_CHAT]: User.LeaveChat;

    [Message.RECEIVE]: Message.Receive;
    [Message.READ_RECEIPT]: Message.ReadReceipt;

    [Message.DELETE_NOTIFY]: Message.DeleteNotify;
    [Message.DELETE_SUCCESS]: Message.DeleteSuccess;

    [Message.UPDATE_NOTIFY]: Message.UpdateNotify;
    [Message.UPDATE_SUCCESS]: Message.UpdateSuccess;

    [Message.SEND_SUCCESS]: Message.SendSuccess;

    [EXCEPTION]: Exception;
  }>;
}

export default ChatSocketListener;

declare namespace Util {
  namespace User {
    /** Base */
    type Payload = MinimalUserEntity;
    /** Base picker */
    type WithKeys<T extends keyof Payload> = Pick<Payload, T>;

    /** Expose error with message to the client. */
    type ActiveUserPayload = { activeUserIds: number[] };
    type ActiveUsersWithKeys<T extends keyof Payload> = WithKeys<T> &
      ActiveUserPayload;

    /** Expose error with message to the client. */
    type FailurePayload = { message?: string };
  }

  namespace Message {
    /** Base */
    type Payload = MessageEntity;
    /** Base picker */
    type WithKeys<T extends keyof Payload> = Pick<Payload, T>;

    /** Expose error with message to the client. */
    type FailurePayload = {
      request: Partial<Payload>;
      message?: string;
    };
  }
}
