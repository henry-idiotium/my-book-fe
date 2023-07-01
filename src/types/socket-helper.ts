/* eslint-disable @typescript-eslint/no-namespace */
export type MapEventPayloadActions<TSchema> = {
  [Key in keyof TSchema]: (payloadArgs: TSchema[Key]) => void;
};
