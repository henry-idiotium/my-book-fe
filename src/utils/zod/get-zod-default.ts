/* eslint-disable
  padding-line-between-statements,
  @typescript-eslint/no-explicit-any,
  @typescript-eslint/no-unsafe-return,
  @typescript-eslint/no-unsafe-argument,
  @typescript-eslint/no-unsafe-member-access,
*/

import { z } from 'zod';

export function getZodDefault<T extends z.AnyZodObject | z.ZodEffects<any>>(
  schema: T
): z.infer<T> {
  // is it a ZodEffect?
  if (schema instanceof z.ZodEffects) {
    // is it a recursive ZodEffect?
    if (schema.innerType() instanceof z.ZodEffects) {
      return getZodDefault(schema.innerType());
    }

    // return schema inner shape as a fresh zodObject
    return getZodDefault(z.ZodObject.create(schema.innerType().shape));
  }

  function getDefaultValue(schema: z.ZodTypeAny): unknown {
    if (schema instanceof z.ZodDefault) return schema._def.defaultValue();
    if (schema instanceof z.ZodOptional) return undefined;
    if (schema instanceof z.ZodNullable) return null;

    if (schema instanceof z.ZodArray) return [];
    if (schema instanceof z.ZodString) return '';
    if (schema instanceof z.ZodNumber) return 0;
    if (schema instanceof z.ZodBoolean) return false;
    if (schema instanceof z.ZodObject) return getZodDefault(schema); // return an content of object recursivly

    if (!('innerType' in schema._def)) return undefined;

    return getDefaultValue(schema._def.innerType);
  }

  return Object.fromEntries(
    Object.entries(schema.shape).map(([key, value]) => {
      return [key, getDefaultValue(value as z.ZodTypeAny)];
    })
  );
}

export default getZodDefault;
