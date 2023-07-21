import { z } from 'zod';

export function zodLiteralUnion<const Literals extends ReadonlyArray<string>>(
  ...literals: Literals
) {
  const literalZods = literals.map((l) => z.literal(l));

  type ZodLiterals = Mutable<{
    [Key in keyof Literals]: z.ZodLiteral<Literals[Key]>;
  }>;

  return z.union(literalZods) as z.ZodUnion<ZodLiterals>;
}

export default zodLiteralUnion;
