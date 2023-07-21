import { ChatSocketListener } from '@/types';

import { ConvoPayloadWrap } from '../helpers';

import Listener = ChatSocketListener.User.Payloads;

export type UpdateActiveUser = ConvoPayloadWrap<Listener.JoinChat>;
