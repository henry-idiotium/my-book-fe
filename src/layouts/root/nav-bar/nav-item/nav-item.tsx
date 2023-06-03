import { IconType } from 'react-icons';
import { NavLink } from 'react-router-dom';

import { DynamicComponent } from '@/components';
import { classes } from '@/utils';

export interface NavItemProps {
  icon: IconType;
  activeIcon?: IconType;
  name: string;
  to?: string;
  hideContent?: boolean;
}

export function NavItem(props: NavItemProps) {
  const { icon: Icon, activeIcon: ActiveIcon = Icon } = props;

  const linkPath = props.to ?? props.name.replace('-', ' ');

  return (
    <NavLink to={linkPath} className="text-color">
      {({ isActive }) => (
        <div className="rounded-full py-2 hover:bg-base-focus">
          <div className="flex w-fit items-center gap-4 px-3 text-xl">
            <div className="py-1">
              <DynamicComponent
                altChosen={isActive}
                el={Icon}
                altEl={ActiveIcon}
                className="wh-[26.25px]"
              />
            </div>

            {!props.hideContent ? (
              <span
                className={classes('pr-4 capitalize <xl:hidden', {
                  'font-bold': isActive,
                })}
              >
                {props.name}
              </span>
            ) : undefined}
          </div>
        </div>
      )}
    </NavLink>
  );
}

export default NavItem;
