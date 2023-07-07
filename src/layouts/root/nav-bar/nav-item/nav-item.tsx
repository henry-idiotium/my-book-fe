import { IconBaseProps } from 'react-icons';
import { NavLink } from 'react-router-dom';

import { Button, DynamicFragment } from '@/components';
import { SingularClassName, classnames } from '@/utils';

import styles from './nav-item.module.scss';

type NavItemIcon = (props: GenericObject) => JSX.Element;
export type NavItemProps = {
  icon: NavItemIcon;
  activeIcon?: NavItemIcon;
  name?: string;
  to?: string;
  hideContent?: boolean;
  iconClassName?: {
    default?: string; // apply both cases
    nonActive?: string;
    active?: string;
  };
};

export function NavItem(props: NavItemProps) {
  const {
    icon: Icon,
    activeIcon: ActiveIcon = Icon,
    hideContent,
    name,
    iconClassName,
  } = props;

  const linkPath = props.to ?? (name ? name.replace('-', ' ') : '');

  const filteredIconClassNames = (isActive: boolean) => {
    let classNames: SingularClassName = undefined;

    if (iconClassName) {
      classNames = iconClassName.default ?? {};

      if (typeof classNames === 'object') {
        iconClassName.active && (classNames[iconClassName.active] = isActive);
        iconClassName.nonActive &&
          (classNames[iconClassName.nonActive] = !isActive);
      }
    }

    return classNames;
  };

  return (
    <NavLink to={linkPath} className={styles.container} tabIndex={-1}>
      {({ isActive }) => (
        <Button className={styles.wrapper} tabIndex={1} type="button">
          <div className={styles.icon}>
            <DynamicFragment<IconBaseProps>
              as={isActive ? ActiveIcon : Icon}
              className={classnames(
                styles.iconImg,
                filteredIconClassNames(isActive),
              )}
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
