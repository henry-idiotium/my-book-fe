import { AnyAction } from '@reduxjs/toolkit';

export function isAnyOf(...matchers: Array<string | { type: string }>) {
  return (action: AnyAction) => {
    return matchers.some((matcher) =>
      typeof matcher === 'string' ? matcher === action.type : matcher.type === action.type,
    );
  };
}

export default isAnyOf;
