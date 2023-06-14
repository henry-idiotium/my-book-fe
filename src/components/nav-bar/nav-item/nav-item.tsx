import { NavLink } from 'react-router-dom';

import styles from './nav-item.module.scss';

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
    <NavLink to={linkPath} className={styles.container}>
      {({ isActive }) => (
        <div className={styles.wrapper}>
          <div className={styles.icon}>
            <DynamicComponent
              cond={!isActive}
              as={Icon}
              asAlt={ActiveIcon}
              className={styles.iconImg}
            />
          </div>

          {!hideContent ? (
            <div
              className={classes(styles.content, {
                [styles.contentRouteActive]: isActive,
              })}
            >
              <span>{name}</span>
            </div>
          ) : undefined}
        </div>
      )}
    </NavLink>
  );
}

export default NavItem;
