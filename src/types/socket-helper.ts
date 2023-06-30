/* eslint-disable @typescript-eslint/no-namespace */
export declare namespace SocketHelper {
  export type MapEventPayloadActions<TSchema> = {
    [Key in keyof TSchema]: (payloadArgs: TSchema[Key]) => void;
  };
}

export default SocketHelper;
