import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { VscChromeClose } from 'react-icons/vsc';
import { useNavigate } from 'react-router-dom';

import styles from './compose-dialog.module.scss';
import FriendChosen from './friend-chosen';
import FriendOption from './friend-option';
import { CreateGroupChat, GroupCreatedResponse } from './types';

import { Button, Dialog, DialogContent, DialogTrigger } from '@/components';
import { useAxios } from '@/hooks';
import { ConversationEntity, MinimalUserEntity } from '@/types';

const contents = {
  DIALOG_TITLE: 'New message',
  INIT_GROUP: 'Create a group',
  SEARCH_INPUT: 'Search people',
};

type ComposeDialogProps = React.PropsWithChildren;

export function ComposeDialog(props: ComposeDialogProps) {
  const { children } = props;

  const navigate = useNavigate();

  // const [searchQuery, setSearchQuery] = useState('');
  const [groupCreationEnabled, setGroupCreationEnabled] = useState(false);
  const [chosenFriendsRecord, setChosenFriendsRecord] = useState<
    GenericObject<MinimalUserEntity>
  >({});

  const [
    { data: currentFriends, loading: currentFriendsFetching },
    friendRequest,
  ] = useAxios<MinimalUserEntity[]>('/friends', { manual: true });
  const [convoRes, convoRequest] = useAxios<ConversationEntity>(
    '/conversations',
    { manual: true }
  );
  const [groupConvoRes, groupRequest] = useAxios<
    GroupCreatedResponse,
    CreateGroupChat
  >('/chatboxes', { manual: true });

  useEffect(() => {
    // navigate to newly created chatbox
    const chatboxId = groupCreationEnabled
      ? groupConvoRes.data?.id
      : convoRes.data?.id;

    if (chatboxId) {
      navigate(chatboxId);
    }
  }, [groupConvoRes.data, convoRes.data]);

  useEffect(() => {
    const chosenFriendsCount = Object.keys(chosenFriendsRecord).length;
    setGroupCreationEnabled(!!(chosenFriendsCount - 1));
  }, [chosenFriendsRecord]);

  function toggleSelectedFriend(id: number, selectedUser?: MinimalUserEntity) {
    return () => {
      const newSelectedFriends = Object.assign({}, chosenFriendsRecord);

      if (chosenFriendsRecord[id]) {
        delete newSelectedFriends[id];
      } else if (selectedUser) {
        newSelectedFriends[id] = selectedUser;
      }

      setChosenFriendsRecord(newSelectedFriends);
    };
  }

  async function createChatbox() {
    if (!convoRes.loading || !groupConvoRes.loading) return;

    // create
    if (groupCreationEnabled) {
      const memberIds = Object.keys(chosenFriendsRecord).map(Number);
      // const name = Object.values(chosenFriendsRecord)
      //   .map(({ firstName, lastName }) => [firstName, lastName].join(' '))
      //   .join(', ');

      await groupRequest({
        method: 'post',
        data: { memberIds },
      });
    } else {
      const userId = Object.keys(chosenFriendsRecord)[0];
      await convoRequest({
        method: 'get',
        url: '/to/' + userId,
      });
    }
  }

  function handleOpen(open: boolean) {
    if (!open || currentFriends) return;
    friendRequest({
      method: 'get',
      params: { take: 10 },
    });
  }

  return (
    <Dialog onOpenChange={handleOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent disablePadding classNames={{ content: styles.container }}>
        <div className={styles.topSection}>
          <Button disableBaseStyles className={styles.topSectionClose}>
            <VscChromeClose />
          </Button>

          <div className={styles.topSectionTitle}>{contents.DIALOG_TITLE}</div>

          <Button
            disabled={!Object.keys(chosenFriendsRecord).length}
            className={styles.topSectionConfirm}
            onClick={createChatbox}
          >
            Confirm
          </Button>
        </div>

        <div className={styles.bottomSection}>
          <div className={styles.bottomSectionSearch}>
            <FiSearch className={styles.bottomSectionSearchIcon} />
            <input
              type="text"
              placeholder={contents.SEARCH_INPUT}
              className={styles.bottomSectionSearchInput}
            />
          </div>

          <div className={styles.bottomSectionChosenFriends}>
            {Object.values(chosenFriendsRecord).map((friend, index) => (
              <FriendChosen
                key={index}
                friendInfo={friend}
                onClick={toggleSelectedFriend(friend.id)}
              />
            ))}
          </div>

          <div className={styles.bottomSectionCurrentFriends}>
            {!currentFriendsFetching ? (
              currentFriends?.map((friend, index) => (
                <FriendOption
                  key={index}
                  friendInfo={friend}
                  chosen={!!chosenFriendsRecord[friend.id]}
                  onClick={toggleSelectedFriend(friend.id, friend)}
                />
              ))
            ) : (
              <>loading...</>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ComposeDialog;
