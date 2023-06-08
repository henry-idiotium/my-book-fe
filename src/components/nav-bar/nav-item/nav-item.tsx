import { NavLink } from 'react-router-dom';

import { DynamicComponent } from '@/components';
import { classes } from '@/utils';

type NavItemIcon = (props: GenericObject) => JSX.Element;
export interface NavItemProps {
  icon: NavItemIcon;
  activeIcon?: NavItemIcon;
  name?: string;
  to?: string;
  hideContent?: boolean;
}

export function NavItem({
  icon: Icon,
  activeIcon: ActiveIcon = Icon,
  to,
  name,
  hideContent,
}: NavItemProps) {
  const linkPath = to ?? (name ? name.replace('-', ' ') : '');

  return (
    <NavLink to={linkPath} className="text-color">
      {({ isActive }) => (
        <div className="w-fit rounded-full py-2 hover:bg-base-focus">
          <div className="flex w-fit items-center gap-4 px-3 text-xl">
            <div className="py-1">
              <DynamicComponent
                cond={!isActive}
                as={Icon}
                asAlt={ActiveIcon}
                className="wh-[26.25px]"
              />
            </div>

            {!hideContent ? (
              <span
                className={classes('pr-4 capitalize <xl:hidden', {
                  'font-bold': isActive,
                })}
              >
                {name}
              </span>
            ) : undefined}
          </div>
        </div>
      )}
    </NavLink>
  );
}

export default NavItem;
