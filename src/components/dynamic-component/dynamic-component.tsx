/* eslint-disable react/jsx-no-useless-fragment */
import { objectOmitKeys } from '@/utils';

export interface DynamicComponentProps extends GenericObject {
  cond: boolean;
  as?: (args: GenericObject) => JSX.Element;
  asAlt?: (args: GenericObject) => JSX.Element;
}

export function DynamicComponent(props: DynamicComponentProps) {
  const { cond, as: el, asAlt: altEl } = props;
  const Component = cond ? el : altEl;
  const args = objectOmitKeys(props, ['cond', 'as', 'asAlt']); // omits props with definition
  return Component ? <Component {...args} /> : <></>;
}

export default DynamicComponent;
