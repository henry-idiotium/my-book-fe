import * as Icon from '@phosphor-icons/react';

import MenuItem from './menu-item';
import ThemeDialog from './theme-dialog';

type MenuScheme = {
  icon: Icon.Icon;
  content: string;
  dialog: (props: React.PropsWithChildren) => JSX.Element;
}[];

export function Menu() {
  const scheme: MenuScheme = [{ icon: Icon.GearSix, content: 'Display', dialog: ThemeDialog }];

  return (
    <div className="">
      {scheme.map(({ icon, content, dialog: Dialog }, index) => (
        <Dialog key={index}>
          <MenuItem icon={icon} content={content} />
        </Dialog>
      ))}
    </div>
  );
}
export default Menu;
