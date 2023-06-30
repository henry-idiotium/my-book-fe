import { FiMoreHorizontal } from 'react-icons/fi';

import styles from './header.module.scss';

import UserImg from '@/assets/account-image.jpg';
import { Button } from '@/components';
import { useSelector } from '@/hooks';
import { selectAuth } from '@/stores';
import { ConversationEntity, MinimalUserEntity } from '@/types';
import { Convo, User } from '@/utils';

type HeaderProps = {
  conversation: ConversationEntity;
};

export function Header(props: HeaderProps) {
  const { conversation: convo } = props;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user: mainUser } = useSelector(selectAuth);

  const titleName = extractTitleName(convo);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.img}>
          <img src={UserImg} alt="conversation display" />
        </div>

        <div className={styles.title}>
          <span>{titleName}</span>
        </div>

        <Button disableBaseStyles className={styles.more}>
          <FiMoreHorizontal />
        </Button>
      </div>
    </div>
  );
}
export default Header;

// todo: refactor, duplicate logic with chat entry
function extractTitleName(convo: ConversationEntity) {
  if (!Convo.isGroup(convo)) {
    const interculator = convo.participants.at(0);
    return interculator ? User.getFullName(interculator) : '[interlocutor]';
  }
  return convo.name;
}
