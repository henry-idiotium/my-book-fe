import { z } from 'zod';

export function zodUnion<const TLiteral extends ReadonlyArray<string>>(
  literals: TLiteral,
) {
  const literalZods = literals.map((l) => z.literal(l));

  type ZodLiterals = Mutable<{
    [Key in keyof TLiteral]: z.ZodLiteral<TLiteral[Key]>;
  }>;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  return z.union(literalZods) as z.ZodUnion<ZodLiterals>;
}

export default zodUnion;
