import { HTMLAttributes, createElement } from 'react';

export type DynamicFragmentProps<TProps> = TProps &
  HTMLAttributes<unknown> &
  React.PropsWithChildren & {
    as: keyof React.ReactHTML | ((props: GenericObject) => JSX.Element);
  };

export function DynamicFragment<TProps = GenericObject>(
  _props: DynamicFragmentProps<TProps>,
) {
  const { as: Element, ...props } = _props;

  if (typeof Element === 'string') {
    return createElement(Element, props);
  }

  return <Element {...props} />;
}
export default DynamicFragment;
