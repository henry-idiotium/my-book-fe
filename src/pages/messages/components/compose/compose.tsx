import * as Icon from '@phosphor-icons/react';
import { useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Dialog } from '@/components';
import { useBoolean, useMap, useUpdateEffect } from '@/hooks';
import { MinimalUserEntity as MinimalUser } from '@/types';

import { MessageCascadeStateContext } from '../../messages.page';

import styles from './compose.module.scss';
import * as Constants from './constants';
import { FriendChosen } from './friend-chosen';
import { FriendOption } from './friend-option';
import { useComposeConversation, useQueryFriend } from './hooks';

/** Conversation/chat composer */
export function Compose() {
  const navigate = useNavigate();

  const propagatedProps = useContext(MessageCascadeStateContext);

  const groupCreationEnabled = useBoolean(false);
  const [chosenFriends, chosenFriendsActions] = useMap(new Map<number, MinimalUser>());

  const [createdConvoId, composeConversation] = useComposeConversation();
  const [
    { currentFriends, loadingCurrentFriends, moreFriendsLoadable },
    { setQuery: setSearchQuery, nextRange: loadMoreFriends },
  ] = useQueryFriend();

  useUpdateEffect(() => {
    if (!createdConvoId) return;

    propagatedProps.reloadEntries();
    navigate(`/messages/${createdConvoId}`);
  }, [createdConvoId]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const toggleFriendSelection = useCallback(
    (id: number, friend?: MinimalUser) => () => {
      const { set: addFriend, remove: removeFriend } = chosenFriendsActions;
      const isFriendSelected = chosenFriends.get(id);

      // If the friend is not selected, add it to the chosen friends list
      if (isFriendSelected) removeFriend(id);
      // If the friend is selected, remove it from the chosen friends list
      else friend && addFriend(id, friend);
    },
    [chosenFriends],
  );

  const handleOpenChange = (open: boolean) => !open && navigate('..');

  const closeDialog = useCallback(() => {
    groupCreationEnabled.toggle();
    groupCreationEnabled.value ? chosenFriendsActions.reset() : navigate('..');
  }, [groupCreationEnabled.value]);

  const goToOrCreateConversation = useCallback(() => {
    const participants = Array.from(chosenFriends.keys());
    if (!participants.length) return;

    return composeConversation(
      groupCreationEnabled.value || chosenFriends.size > 1
        ? { type: 'group', payload: { participants } }
        : { type: 'pair', payload: { interlocutorId: participants[0] } },
    );
  }, [chosenFriends]);

  return (
    <Dialog defaultOpen open onOpenChange={handleOpenChange}>
      <Dialog.Content disablePadding classNames={{ content: styles.container }}>
        <div className={styles.topSection}>
          <Button
            disableBaseStyles
            className={styles.topSectionGoBack}
            title="back"
            onClick={closeDialog}
          >
            {groupCreationEnabled.value ? <Icon.ArrowLeft /> : <Icon.X />}
          </Button>

          <div className={styles.topSectionTitle}>
            <span className={styles.topSectionTitlePrimary}>
              {groupCreationEnabled.value ? Constants.TITLE_BASE : Constants.TITLE_GROUP_PRIMARY}
            </span>

            {groupCreationEnabled.value ? (
              <span className={styles.topSectionTitleSecondary}>
                {Constants.TITLE_GROUP_SECONDARY}
              </span>
            ) : null}
          </div>

          <Button
            disableBaseStyles
            disabled={!chosenFriends.size}
            className={styles.topSectionNext}
            onClick={goToOrCreateConversation}
          >
            Next
          </Button>
        </div>

        <div className={styles.bottomSection}>
          <div className={styles.bottomSectionSearch}>
            <Icon.MagnifyingGlass className={styles.bottomSectionSearchIcon} />
            <input
              autoFocus
              type="text"
              placeholder={Constants.SEARCH_INPUT}
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
                <Icon.UsersThree />
              </div>
              <div className={styles.bottomSectionGroupContent}>
                <span>{Constants.INIT_GROUP}</span>
              </div>
            </Button>
          ) : (
            <div className={styles.bottomSectionChosenFriends}>
              {Array.from(chosenFriends.entries()).map(([id, friend], index) => (
                <FriendChosen key={index} friend={friend} onClick={toggleFriendSelection(id)} />
              ))}
            </div>
          )}

          <div className={styles.bottomSectionCurrentFriends}>
            {!loadingCurrentFriends && currentFriends
              ? currentFriends.map((friend, index) => (
                  <FriendOption
                    key={index}
                    friend={friend}
                    chosen={chosenFriends.has(friend.id)}
                    onClick={toggleFriendSelection(friend.id, friend)}
                  />
                ))
              : 'loading...'}

            {moreFriendsLoadable ? (
              <Button
                disableBaseStyles
                className={styles.bottomSectionCurrentFriendsLoadMore}
                onClick={loadMoreFriends}
              >
                {Constants.LOAD}
              </Button>
            ) : null}
          </div>
        </div>
      </Dialog.Content>
    </Dialog>
  );
}

export default Compose;
