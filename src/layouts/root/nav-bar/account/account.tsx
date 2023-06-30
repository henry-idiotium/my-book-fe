import styles from './account.module.scss';
import Menu from './menu/menu';
import ProfileButton from './profile-button/profile-button';

import { Popover } from '@/components';

export function Account() {
  return (
    <div className={styles.container}>
      <Popover>
        <Popover.Trigger asChild>
          <ProfileButton />
        </Popover.Trigger>

        <Popover.Content className={styles.popover} align="start">
          <Menu />
        </Popover.Content>
      </Popover>
    </div>
  );
}

export default Account;
