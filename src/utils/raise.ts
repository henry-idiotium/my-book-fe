export function raise(message?: string): never {
  throw new Error(message);
}

export function safeRaise(message?: string) {
  if (import.meta.env.DEV) raise(message);
}
