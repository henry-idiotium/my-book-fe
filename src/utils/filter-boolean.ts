/**
 * Filter undefined and null values.
 * @example
 * [1, 2, 0, null].filter(nonNullable) // number[]
 */
export function nonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

/**
 * Filter falsy values.
 * @example
 * [1, 2, 0, null].filter(truthy) // number[]
 */
export const truthy = <T>(value: T): value is Truthy<T> => !!value;
type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T;
