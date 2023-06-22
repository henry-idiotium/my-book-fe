/**
 * They filter falsy values and yield NON Nullable type at runtime.
 *
 * Useages:
 *
 * [1, 2, 0, null].filter(nonNullable) // number[]
 * [1, 2, 0, null].filter(truthy) // number[]
 */

/**
 * Filter undefined and null values.
 */
export function nonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T;

/**
 * Filter falsy values.
 */
export function truthy<T>(value: T): value is Truthy<T> {
  return !!value;
}
