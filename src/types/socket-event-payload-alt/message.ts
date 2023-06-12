type Payload = {
  id: string;
  content: string;
  isGroup: boolean;
  chatboxId: string;
};
type With<T extends keyof Payload> = Pick<Payload, T>;

export type Sent = With<'content'>;
export type Updating = With<'id' | 'content'>;
export type Updated = Updating;
export type Deleted = With<'id'>;
export type Deleting = With<'id'>;
