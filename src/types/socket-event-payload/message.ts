import { MessageEntity } from '../message';

type Payload = {
  id: string;
  content: string;
  isGroup: boolean;
  chatboxId: string;
};
type With<T extends keyof Payload> = Pick<Payload, T>;

export type Sent = With<'content'>;
export type Received = MessageEntity;
export type Updating = With<'id' | 'content'>;
export type Updated = Updating;
export type Deleting = With<'id'>;
export type Deleted = Deleting;
