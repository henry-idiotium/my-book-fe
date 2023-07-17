import { useContext } from 'react';
import { FiMoreHorizontal } from 'react-icons/fi';

import UserImg from '@/assets/account-image.jpg';
import { Button } from '@/components';

import { ConversationCascadeStateContext } from '../context-cascade';

import styles from './header.module.scss';

export function Header() {
  const [{ chatSocketState }] = useContext(ConversationCascadeStateContext);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.img}>
          <img src={UserImg} alt="conversation display" />
        </div>

        <div className={styles.title}>
          <span>{chatSocketState.name}</span>
        </div>

        <Button disableBaseStyles className={styles.more}>
          <FiMoreHorizontal />
        </Button>
      </div>
    </div>
  );
}
export default Header;
