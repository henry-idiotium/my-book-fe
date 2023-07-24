import { type Icon as IconType } from '@phosphor-icons/react';
import { NavLink } from 'react-router-dom';

import { Button } from '@/components';
import { classnames } from '@/utils';

import styles from './nav-item.module.scss';

export type NavItemProps = {
  icon: IconType;
  hideName?: boolean;
  to?: string;
  name?: string;
};

export function NavItem(props: NavItemProps) {
  const { icon: Icon, hideName } = props;

  const linkPath = props.to ?? props.name?.replace('-', ' ') ?? '';

  return (
    <NavLink to={linkPath} className={styles.container} tabIndex={-1}>
      {({ isActive }) => (
        <Button className={styles.wrapper} tabIndex={1} type="button">
          <div className={styles.icon}>
            <Icon className={classnames(styles.iconImg)} weight={isActive ? 'fill' : 'regular'} />
          </div>

          {!hideName ? (
            <span
              className={classnames(styles.content, {
                [styles.contentRouteActive]: isActive,
              })}
            >
              {props.name}
            </span>
          ) : null}
        </Button>
      )}
    </NavLink>
  );
}

export default NavItem;
