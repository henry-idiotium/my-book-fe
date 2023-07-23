export type MapEventPayloadActions<TSchema> = {
  [Key in keyof TSchema]: TSchema[Key] extends Array<unknown>
    ? (...payloadArgs: TSchema[Key]) => void
    : (payloadArgs: TSchema[Key]) => void;
};

export type Acknowledgment<Request, Response> = [
  request: Request,
  response: (args: Response) => void,
];
