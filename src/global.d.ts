/* eslint-disable
  @typescript-eslint/no-empty-interface,
  @typescript-eslint/no-namespace
*/

import { z } from 'zod';

const envVariables = z.object({
  NODE_ENV: z.union([z.literal('development'), z.literal('production')]),
  DB_URL: z.string().url().optional(),
});

envVariables.parse(process.env);

declare global {
  type Nullable<Type> = Type | undefined | null;
  type GenericObject<Type = unknown> = object & Record<string | number, Type>;
  type AtLeast<Type, Key extends keyof Type> = Partial<Type> &
    Required<Pick<Type, Key>>;
  type DeepPartial<Type> = Type extends object
    ? { [Key in keyof Type]?: DeepPartial<Type[Key]> }
    : Type;
  type Mutable<Type> = { -readonly [Key in keyof Type]-?: Type[Key] };
  type PartialStrict<T extends string, M = string> = T | Omit<M, T>;

  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}

export {};
