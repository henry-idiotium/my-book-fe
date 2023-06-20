import { IconType } from 'react-icons';
import { BiCog } from 'react-icons/bi';

import MenuItem from './menu-item';
import ThemeDialog from './theme-dialog';

type MenuScheme = {
  icon: IconType;
  content: string;
  dialog: (props: React.PropsWithChildren) => JSX.Element;
}[];

export function Menu() {
  const scheme: MenuScheme = [
    { icon: BiCog, content: 'Display', dialog: ThemeDialog },
  ];

  return (
    <div className="">
      <div className="">
        {scheme.map(({ icon, content, dialog: Dialog }, index) => (
          <Dialog key={index}>
            <MenuItem icon={icon} content={content} />
          </Dialog>
        ))}
      </div>
    </div>
  );
}
export default Menu;
