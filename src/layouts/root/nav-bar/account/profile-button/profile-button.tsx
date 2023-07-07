import { forwardRef } from 'react';
import { BsThreeDots } from 'react-icons/bs';

import accountImage from '@/assets/account-image.jpg';
import { useSelector } from '@/hooks';
import { selectAuth } from '@/stores';

import styles from './profile-button.module.scss';

interface ProfileButtonProps {
  onClick?: () => void;
}

export const ProfileButton = forwardRef<HTMLButtonElement, ProfileButtonProps>(
  ({ onClick }, ref) => {
    const { user } = useSelector(selectAuth);

    return (
      <button ref={ref} className={styles.container} onClick={onClick}>
        <div className={styles.wrapper}>
          <div className={styles.avatar}>
            <div className={styles.avatarWrapper}>
              <img
                className={styles.avatarImg}
                src={accountImage}
                alt="User avatar"
              />
            </div>
          </div>

          <div className={styles.info}>
            <div className={styles.infoWrapper}>
              <div className={styles.infoName}>
                <span>
                  {user.firstName} {user.lastName}
                </span>
              </div>

              <div className={styles.infoId}>
                <span>@{user.alias}</span>
              </div>
            </div>
          </div>

          <div className={styles.more}>
            <BsThreeDots />
          </div>
        </div>
      </button>
    );
  },
);
export default ProfileButton;
