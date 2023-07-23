import { Popover } from '@/components';

import styles from './account.module.scss';
import Menu from './menu/menu';
import ProfileButton from './profile-button/profile-button';

export function Account() {
  return (
    <div className={styles.container}>
      <Popover>
        <Popover.Trigger asChild>
          <ProfileButton />
        </Popover.Trigger>

        <Popover.Content className="!w-[300px] py-3" align="start">
          <Menu />
        </Popover.Content>
      </Popover>
    </div>
  );
}

export default Account;
