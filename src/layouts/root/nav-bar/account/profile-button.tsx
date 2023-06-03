import { Button } from '@material-tailwind/react';
import { forwardRef } from 'react';
import { BsThreeDots } from 'react-icons/bs';

import styles from './account.module.scss';

import accountImage from '@/assets/account-image.png';

interface ProfileButtonProps {
  onClick?: () => void;
}

export const ProfileButton = forwardRef<HTMLButtonElement, ProfileButtonProps>(
  ({ onClick }, ref) => {
    return (
      <button ref={ref} className={styles.wrapper} onClick={onClick}>
        <div className={styles.wrapperInner}>
          <div className={styles.userAvatar}>
            <div className={styles.avatarContainer}>
              <img
                className={styles.avatar}
                src={accountImage}
                alt="User avatar"
              />
            </div>
          </div>

          <div className={styles.userInfo}>
            <div className={styles.userInfoWrapper}>
              <div className={styles.userInfoName}>
                <span>Henry D. Anthony</span>
              </div>

              <div className={styles.userInfoId}>
                <span>@the_real_henry_anthony</span>
              </div>
            </div>
          </div>

          <div className={styles.moreIcon}>
            <BsThreeDots />
          </div>
        </div>
      </button>
    );
  }
);
export default ProfileButton;
