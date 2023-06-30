/* eslint-disable @typescript-eslint/no-namespace */

import { PayloadAction } from '@reduxjs/toolkit';

import {
  ChatSocketListener as LPayload,
  ChatSocketEmitter as EPayload,
} from '@/types';

type Wrap<T> = PayloadAction<T>;
type ConvoWrap<T> = PayloadAction<T & { conversationId: string }>;

export declare namespace Payload {
  type Connect = Wrap<LPayload.User.Connect>;

  type JoinChat = ConvoWrap<LPayload.User.JoinChat>;
  type LeaveChat = ConvoWrap<LPayload.User.LeaveChat>;

  namespace Message {
    type Pending = ConvoWrap<EPayload.Message.Send>;

    type SendSuccess = ConvoWrap<LPayload.Message.SendSuccess>;

    type Receive = ConvoWrap<LPayload.Message.Receive>;

    type ReadReceipt = ConvoWrap<LPayload.Message.ReadReceipt>;

    type DeleteNotify = ConvoWrap<LPayload.Message.DeleteNotify>;
    type DeleteSuccess = ConvoWrap<LPayload.Message.DeleteSuccess>;

    type UpdateNotify = ConvoWrap<LPayload.Message.UpdateNotify>;
    type UpdateSuccess = ConvoWrap<LPayload.Message.UpdateSuccess>;
  }
}
