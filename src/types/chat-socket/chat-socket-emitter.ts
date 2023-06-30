/* eslint-disable @typescript-eslint/no-namespace */
import { MessageEntity } from '../conversations';
import Helper from '../socket-helper';

export declare namespace ChatSocketEmitter {
  namespace User {}

  namespace Message {
    /** When the user sends a new message. */
    const SEND = 'message_send';
    type Send = Util.Message.WithKeys<'content' | 'at'>;

    /** When the user updates a message. */
    const UPDATE = 'message_update';
    type Update = Util.Message.WithKeys<'content' | 'id'>;

    /** When the user deletes a message. */
    const DELETE = 'message_delete';
    type Delete = Util.Message.WithKeys<'id'>;

    /** When the user sees a message. */
    const SEEN = 'message_seen';
    type Seen = Util.Message.WithKeys<'id'>;
  }

  /**
   * Event types map between socket event key and theircorresponding
   * payload types.
   */
  type Events = Helper.MapEventPayloadActions<{
    [Message.SEEN]: Message.Seen;
    [Message.SEND]: Message.Send;
    [Message.UPDATE]: Message.Update;
    [Message.DELETE]: Message.Delete;
  }>;
}

export default ChatSocketEmitter;

declare namespace Util {
  namespace Message {
    type BasePayload = { isGroup: boolean };
    type OptionalPayload = RequireNonOptional<MessageEntity>;

    type WithKeys<T extends keyof OptionalPayload> = BasePayload &
      Pick<OptionalPayload, T>;
  }
}
