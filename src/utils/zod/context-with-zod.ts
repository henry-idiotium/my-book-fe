import { createContext } from 'react';
import { z } from 'zod';

import { getZodDefault } from '.';

/**
 * Get React's Context API by using Zod Schema.
 * @remarks Most often if not all the time, context will be an object rather
 *    than a primitive one, so the param is Zod Object Shape.
 */
export const contextWithZod = <T extends z.ZodRawShape>(shape: T) => {
  return createContext(getZodDefault(z.object(shape)));
};
export default contextWithZod;
