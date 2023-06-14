export type DynFragProps<TProps> = React.HTMLAttributes<TProps> &
  React.PropsWithChildren & {
    cond: boolean;
    expected?: (args: GenericObject) => JSX.Element;
    alternative?: (args: GenericObject) => JSX.Element;
  };

// dynamic fragment
export function DynFrag<TProps = GenericObject>(props: DynFragProps<TProps>) {
  const {
    cond: condition,
    expected: ExpectedComponent,
    alternative: AlternativeComponent,
    children,
    ...args
  } = props;

  // if children is used instead
  if (children) {
    if (condition) return children;

    return AlternativeComponent ? <AlternativeComponent /> : undefined;
  }

  const Component = condition ? ExpectedComponent : AlternativeComponent;
  return Component ? <Component {...args} /> : undefined;
}

export default DynFrag;
