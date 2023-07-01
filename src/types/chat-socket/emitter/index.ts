import * as Message from './message';

import { MapEventPayloadActions } from '@/types/socket-helper';

export type ChatSocketEmitEvents = MapEventPayloadActions<{
  [Message.Events.SEEN]: Message.Payloads.Seen;
  [Message.Events.SEND]: Message.Payloads.Send;
  [Message.Events.UPDATE]: Message.Payloads.Update;
  [Message.Events.DELETE]: Message.Payloads.Delete;
}>;

export { Message };
