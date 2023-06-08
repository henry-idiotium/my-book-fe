import { IconType } from 'react-icons';
import { BiCog } from 'react-icons/bi';

import MenuItem from './menu-item';
import ThemeDialog from './theme-dialog';

import { DialogProps } from '@/components';

type MenuScheme = {
  icon: IconType;
  content: string;
  dialog: <T extends Pick<DialogProps, 'trigger'>>(props: T) => JSX.Element;
}[];

export function Menu() {
  const scheme: MenuScheme = [
    { icon: BiCog, content: 'display', dialog: ThemeDialog },
  ];

  return (
    <div className="">
      <div className="">
        {scheme.map(({ icon, content, dialog: Dialog }, index) => (
          <Dialog
            key={index}
            trigger={({ toggle }) => (
              <MenuItem icon={icon} content={content} onClick={toggle} />
            )}
          />
        ))}
      </div>
    </div>
  );
}
export default Menu;
