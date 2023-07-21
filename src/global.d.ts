declare global {
  type Nullable<Type> = Type | undefined | null;

  type RequiredNotNull<T> = { [P in keyof T]: NonNullable<T[P]> };

  type GenericObject<Type = unknown> = object & Record<string | number, Type>;

  type Mutable<Type> = { -readonly [Key in keyof Type]-?: Type[Key] };

  type PartialPick<T, O extends keyof T> = Partial<Pick<T, O>> & Omit<T, O>;

  type RequiredPick<T, O extends keyof T> = Required<Pick<T, O>> & Omit<T, O>;

  type RequiredNotNullPick<T, Key extends keyof T> = Omit<T, Key> & {
    [P in Key]: NonNullable<T[P]>;
  };
}

export {};
