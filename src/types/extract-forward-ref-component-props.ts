export type ExtractForwardRefComponentProps<T> =
  T extends React.ForwardRefExoticComponent<React.RefAttributes<infer Props>>
    ? Props
    : never;
