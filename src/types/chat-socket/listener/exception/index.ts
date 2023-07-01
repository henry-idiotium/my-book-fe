/** When other clients has seen sent message. */
export const EXCEPTION = 'exception';
export type Exception = { name: string; message: string; stack?: string };
