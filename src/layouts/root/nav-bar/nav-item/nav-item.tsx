import { IconBaseProps } from 'react-icons';
import { NavLink } from 'react-router-dom';

import styles from './nav-item.module.scss';

import { Button, DynamicFragment } from '@/components';
import { classnames } from '@/utils';

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
    <NavLink to={linkPath} className={styles.container} tabIndex={-1}>
      {({ isActive }) => (
        <Button className={styles.wrapper} tabIndex={1} type="button">
          <div className={styles.icon}>
            <DynamicFragment<IconBaseProps>
              as={isActive ? ActiveIcon : Icon}
              className={styles.iconImg}
            />
          </div>

          {!hideContent ? (
            <div
              className={classnames(styles.content, {
                [styles.contentRouteActive]: isActive,
              })}
            >
              <span>{name}</span>
            </div>
          ) : undefined}
        </Button>
      )}
    </NavLink>
  );
}

export default NavItem;
