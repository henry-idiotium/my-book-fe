import { IconType } from 'react-icons';
import { NavLink } from 'react-router-dom';

import { classes } from '@/utils';

export interface NavItemProps {
  icon: IconType;
  name: string;
  to: string;
}

export function NavItem(props: NavItemProps) {
  const { icon: Icon, name, to } = props;

  return (
    <div className="py-3">
      <div className="w-full">
        <NavLink
          to={to}
          className={({ isActive, isPending }) =>
            classes({
              'text-purple-600': isPending,
              'text-red-500': isActive,
            })
          }
        >
          <div className="flex w-fit items-center gap-4 px-3 text-xl">
            <div className="p-1">
              <Icon className="wh-[30px]" />
            </div>

            <span className="capitalize">{name}</span>
          </div>
        </NavLink>
      </div>
    </div>
  );
}

export default NavItem;
