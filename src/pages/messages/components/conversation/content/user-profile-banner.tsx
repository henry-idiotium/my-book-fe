import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import UserAvatar from '@/assets/account-image.jpg';
import { MinimalUserEntity } from '@/types';
import { User, formatTimeReadable } from '@/utils';

import * as constants from './constants';

type ProfileBannerProps = {
  interlocutor: MinimalUserEntity;
};

/**
 * A banner show information of the opposite interlocutor in a one-to-one
 * conversation.
 *
 * @remarks This component should only used for paired conversation.
 */
export function UserProfileBanner(props: ProfileBannerProps) {
  const { interlocutor } = props;

  const navigate = useNavigate();

  const goToUserProfile = useCallback(() => navigate(`/${interlocutor.alias}`), []);

  const userJoinedTime = useMemo(() => {
    if (!interlocutor.createdAt) return;
    return formatTimeReadable(interlocutor.createdAt, { type: 'no times' });
  }, []);

  return (
    <div className="block">
      <button
        className="mb-4 w-full border-b border-color transition-colors hover:bg-base-hover"
        style={{ height: constants.PROFILE_BANNER_HEIGHT }}
        onClick={goToUserProfile}
      >
        <div className="px-4 py-5 wh-full">
          <div className="flex flex-col items-center wh-full">
            <div className="overflow-hidden rounded-full wh-16">
              <img src={interlocutor.photo ?? UserAvatar} alt="user avatar" className="wh-full" />
            </div>

            <div className="mt-1 font-bold text-color">
              <span>{User.getFullName(interlocutor)}</span>
            </div>

            <div className="mt-[2px] font-light text-color-accent">
              <span>@{interlocutor.alias}</span>
            </div>

            {userJoinedTime ? (
              <div className="mt-3 text-sm font-light text-color-accent">
                <span>{`Joined ${userJoinedTime}`}</span>
              </div>
            ) : null}
          </div>
        </div>
      </button>
    </div>
  );
}
export default UserProfileBanner;
