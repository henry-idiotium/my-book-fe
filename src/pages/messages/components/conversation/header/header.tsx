import { useContext } from 'react';
import { FiMoreHorizontal } from 'react-icons/fi';

import UserImg from '@/assets/account-image.jpg';
import { Button } from '@/components';

import { ConversationCascadeStateContext } from '../conversation';

import styles from './header.module.scss';

// eslint-disable-next-line @typescript-eslint/ban-types
type HeaderProps = {};

export function Header(props: HeaderProps) {
  const { activeConversation: convo } = useContext(
    ConversationCascadeStateContext,
  );

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.img}>
          <img src={UserImg} alt="conversation display" />
        </div>

        <div className={styles.title}>
          <span>{convo.name}</span>
        </div>

        <Button disableBaseStyles className={styles.more}>
          <FiMoreHorizontal />
        </Button>
      </div>
    </div>
  );
}
export default Header;
