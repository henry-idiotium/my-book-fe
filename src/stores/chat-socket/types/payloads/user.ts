import { ChatSocketListener } from '@/types';

import { ConvoWrap, Wrap } from './helpers';

import Listener = ChatSocketListener.User.Payloads;

export type Connect = Wrap<Listener.Connect>;

export type JoinChat = ConvoWrap<Listener.JoinChat>;
export type LeaveChat = ConvoWrap<Listener.LeaveChat>;
