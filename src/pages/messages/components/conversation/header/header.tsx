import * as Icon from '@phosphor-icons/react';
import { useContext } from 'react';

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
          <Icon.DotsThree />
        </Button>
      </div>
    </div>
  );
}
export default Header;
