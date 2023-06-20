import styles from './account.module.scss';
import Menu from './menu/menu';
import ProfileButton from './profile-button/profile-button';

import { Popover, PopoverContent, PopoverTrigger } from '@/components';

export function Account() {
  return (
    <div className={styles.container}>
      <Popover>
        <PopoverTrigger asChild>
          <ProfileButton />
        </PopoverTrigger>

        <PopoverContent className={styles.popover} align="start">
          <Menu />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default Account;
