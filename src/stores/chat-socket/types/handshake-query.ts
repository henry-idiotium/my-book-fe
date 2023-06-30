import { z } from 'zod';

export type HandshakeQuery = z.infer<typeof handshakeQueryZod>;
export const handshakeQueryZod = z.object({
  conversationId: z.string(),
});
