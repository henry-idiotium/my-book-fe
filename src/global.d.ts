declare global {
  type Nullable<Type> = Type | undefined | null;
  type GenericObject<Type = unknown> = object & Record<string | number, Type>;
  type AtLeast<Type, Key extends keyof Type> = Partial<Type> &
    Required<Pick<Type, Key>>;
  type DeepPartial<Type> = Type extends object
    ? { [Key in keyof Type]?: DeepPartial<Type[Key]> }
    : Type;
  type Mutable<Type> = { -readonly [Key in keyof Type]-?: Type[Key] };
  type PartialPick<T, O extends keyof T> = Partial<Pick<T, O>> & Omit<T, O>;
  type RequiredPick<T, O extends keyof T> = Omit<T, O> & Required<Pick<T, O>>;
  type HasNullable<T, TLeft, TRight = never> = Extract<
    T,
    undefined | null
  > extends never
    ? TLeft
    : TRight;

  type RequireNonOptional<T> = { [P in keyof T]-?: NonNullable<T[P]> };
}

export {};
