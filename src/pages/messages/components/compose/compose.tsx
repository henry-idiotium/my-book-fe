import { UsersThree as UsersThreeIcon } from '@phosphor-icons/react';
import { FaArrowLeft } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';
import { VscChromeClose } from 'react-icons/vsc';
import { useNavigate } from 'react-router-dom';
import { useBoolean, useMap } from 'usehooks-ts';

import { useComposeConversation, useQueryFriend } from '../../hooks';

import styles from './compose.module.scss';
import FriendChosen from './friend-chosen';
import FriendOption from './friend-option';

import {
  Button,
  Dialog,
  DialogContent,
  DynamicFragment,
  PageMeta,
} from '@/components';
import { MinimalUserEntity } from '@/types';
import { User } from '@/utils';

const contents = {
  INIT_GROUP: 'Create a group',
  SEARCH_INPUT: 'Search people',
  LOAD: 'Load more',
  title: {
    base: 'New message',
    group: {
      primary: 'Create a group',
      secondary: 'Add friend',
    },
  },
};

/**Conversation/chat composer */
export function Compose() {
  const navigate = useNavigate();

  const groupCreationEnabled = useBoolean(false);
  const [chosenFriends, chosenFriendsActions] = useMap(
    new Map<number, MinimalUserEntity>()
  );

  const composeConversation = useComposeConversation();
  const [
    { currentFriends, loadingCurrentFriends, moreFriendsLoadable },
    { setQuery: setSearchQuery, nextRange: nextCurrentFriendsRange },
  ] = useQueryFriend();

  function loadMoreFriends() {
    nextCurrentFriendsRange();
  }

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;
    setSearchQuery(query);
  }

  function toggleChosenFriend(id: number, friendToAdd?: MinimalUserEntity) {
    const isFriendSelected = chosenFriends.get(id);
    const { set: addFriend, remove: removeFriend } = chosenFriendsActions;
    return () => {
      if (!isFriendSelected) {
        // If the friend is not selected, add it to the chosen friends list
        friendToAdd && addFriend(id, friendToAdd);
      } else {
        // If the friend is selected, remove it from the chosen friends list
        removeFriend(id);
      }
    };
  }

  function handleOpenChange(open: boolean) {
    if (open) return;
    navigate('..');
  }

  function goBack() {
    if (groupCreationEnabled.value) {
      groupCreationEnabled.setFalse();
      chosenFriendsActions.reset();
    } else {
      navigate('..');
    }
  }

  /** Create conversation */
  async function goNext() {
    if (groupCreationEnabled.value || chosenFriends.size > 1) {
      const members = Array.from(chosenFriends.values());
      const memberIds = Array.from(chosenFriends.keys());
      const name = User.getDefaultGroupName(members);

      await composeConversation({
        type: 'group',
        payload: { name, memberIds },
      });
    } else {
      const interlocutorId = Array.from(chosenFriends.keys())[0];
      if (!interlocutorId) return;

      await composeConversation({
        type: 'pair',
        payload: { interlocutorId },
      });
    }
  }

  return (
    <PageMeta title="Compose" auth={{ type: 'private' }}>
      <Dialog defaultOpen onOpenChange={handleOpenChange}>
        <DialogContent
          disablePadding
          classNames={{ content: styles.container }}
        >
          <div className={styles.topSection}>
            <Button
              disableBaseStyles
              className={styles.topSectionBack}
              title="back"
              onClick={goBack}
            >
              <DynamicFragment
                as={!groupCreationEnabled.value ? VscChromeClose : FaArrowLeft}
              />
            </Button>

            <div className={styles.topSectionTitle}>
              <span className={styles.topSectionTitlePrimary}>
                {groupCreationEnabled.value
                  ? contents.title.base
                  : contents.title.group.primary}
              </span>

              {groupCreationEnabled.value ? (
                <span className={styles.topSectionTitleSeconday}>
                  {contents.title.group.secondary}
                </span>
              ) : null}
            </div>

            <Button
              disableBaseStyles
              disabled={!chosenFriends.size}
              className={styles.topSectionNext}
              onClick={goNext}
            >
              Next
            </Button>
          </div>

          <div className={styles.bottomSection}>
            <div className={styles.bottomSectionSearch}>
              <FiSearch className={styles.bottomSectionSearchIcon} />
              <input
                autoFocus
                type="text"
                placeholder={contents.SEARCH_INPUT}
                className={styles.bottomSectionSearchInput}
                onChange={handleSearchChange}
              />
            </div>

            {!chosenFriends.size && !groupCreationEnabled.value ? (
              <Button
                disableRipple
                disableBaseStyles
                className={styles.bottomSectionGroup}
                onClick={groupCreationEnabled.toggle}
              >
                <div className={styles.bottomSectionGroupIcon}>
                  <UsersThreeIcon />
                </div>
                <div className={styles.bottomSectionGroupContent}>
                  <span>{contents.INIT_GROUP}</span>
                </div>
              </Button>
            ) : (
              <div className={styles.bottomSectionChosenFriends}>
                {Array.from(chosenFriends.entries()).map(
                  ([id, friend], index) => (
                    <FriendChosen
                      key={index}
                      friendInfo={friend}
                      onClick={toggleChosenFriend(id)}
                    />
                  )
                )}
              </div>
            )}

            <div className={styles.bottomSectionCurrentFriends}>
              {!loadingCurrentFriends && currentFriends ? (
                currentFriends.map((friend, index) => (
                  <FriendOption
                    key={index}
                    friendInfo={friend}
                    chosen={chosenFriends.has(friend.id)}
                    onClick={toggleChosenFriend(friend.id, friend)}
                  />
                ))
              ) : (
                <>loading...</>
              )}

              {moreFriendsLoadable ? (
                <Button
                  disableBaseStyles
                  className={styles.bottomSectionCurrentFriendsLoadMore}
                  onClick={loadMoreFriends}
                >
                  {contents.LOAD}
                </Button>
              ) : null}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageMeta>
  );
}

export default Compose;
