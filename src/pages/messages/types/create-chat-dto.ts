/* eslint-disable @typescript-eslint/no-namespace */
import { z } from 'zod';

import { ConversationEntity } from '@/types';

export namespace CreateChat {
  export namespace Pair {
    export type Response = ConversationEntity;
  }

  export namespace Group {
    export type Response = z.infer<typeof response>;
    export const response = z.object({
      id: z.string(),
      admin: z.number(),
      name: z.string().optional(),
      photo: z.string().optional(),
      successMemberIds: z.array(z.number()).optional(),
      failedMemberIds: z.array(z.number()).optional(),
    });

    export type Request = z.infer<typeof request>;
    export const request = z.object({
      name: z.string().optional(),
      photo: z.string().optional(),
      memberIds: z.array(z.number()).optional(),
    });
  }
}
