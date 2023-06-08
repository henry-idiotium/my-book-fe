import styles from './account.module.scss';
import Menu from './menu/menu';
import ProfileButton from './profile-button';

import { Popover } from '@/components';

export function Account() {
  return (
    <div className={styles.container}>
      <Popover
        trigger={<ProfileButton />}
        placement="top-end"
        className="w-56 border-none bg-base"
      >
        <Menu />
      </Popover>
    </div>
  );
}

export default Account;
