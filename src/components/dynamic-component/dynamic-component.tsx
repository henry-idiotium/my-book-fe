import { objectOmitKeys } from '@/utils';

export interface DynamicComponentProps extends GenericObject {
  altChosen: boolean;
  el: (args: GenericObject) => JSX.Element;
  altEl: (args: GenericObject) => JSX.Element;
}

export function DynamicComponent(props: DynamicComponentProps) {
  const { altChosen, el, altEl } = props;
  const Component = altChosen ? altEl : el;
  const args = objectOmitKeys(props, ['altChosen', 'el', 'altEl']); // omits props with definition
  return <Component {...args} />;
}

export default DynamicComponent;
