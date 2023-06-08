declare global {
  type Nullable<Type> = Type | undefined | null;
  type GenericObject<Type = unknown> = object & Record<string | number, Type>;
  type AtLeast<Type, Key extends keyof Type> = Partial<Type> &
    Required<Pick<Type, Key>>;
  type DeepPartial<Type> = Type extends object
    ? { [Key in keyof Type]?: DeepPartial<Type[Key]> }
    : Type;
  type Mutable<Type> = { -readonly [Key in keyof Type]-?: Type[Key] };
  type PartialStrict<T extends string, M = string> = T | Omit<M, T>;
  type PartialPick<T, O extends keyof T> = Partial<Pick<T, O>> & Omit<T, O>;

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
    }
  }
}

export {};
