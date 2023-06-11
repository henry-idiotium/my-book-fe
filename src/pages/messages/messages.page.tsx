import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { HiOutlineCog } from 'react-icons/hi';
import { LuMailPlus } from 'react-icons/lu';

import {
  ChatEntryProps,
  ChatEntry,
  Conversation,
  EmptyConversation,
  ChatboxEntry,
} from './components';
import styles from './messages.page.module.scss';

import { Input, LoadingScreen } from '@/components';
import { useAltAxios } from '@/hooks/use-alt-axios';
import { ConversationEntity, ConversationGroupEntity } from '@/types';

export function Messages() {
  const headerOptions = getHeaderOptionScheme();

  // chats between two
  const [pairRes, fetchPairs] = useAltAxios<ConversationEntity[]>(
    `/conversations`,
    { manual: true }
  );
  // chats between multiple, or group
  const [groupRes, fetchGroups] = useAltAxios<ConversationGroupEntity[]>(
    `/chatboxes`,
    { manual: true }
  );

  const [activeChatId, setActiveChatId] = useState<string>();
  const [chatEntries, setChatEntries] = useState<ChatboxEntry[]>([]);

  useEffect(() => {
    if (!pairRes.data) fetchPairs();

    if (!groupRes.data) fetchGroups();
  }, []);

  // merge fetched data
  useEffect(() => {
    const pairChats = pairRes.data ?? [];
    const groupChats = groupRes.data ?? [];

    setChatEntries([...pairChats, ...groupChats]);
  }, [pairRes.data, groupRes.data]);

  function handleSelectChatEntry(convoId: string) {
    setActiveChatId(convoId);
    // more...
  }

  if (pairRes.loading || groupRes.loading) return <LoadingScreen />;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.chatboxesPane}>
          <div className={styles.chatbox}>
            <div className={styles.chatboxHeader}>
              <h2>Messages</h2>

              <div className={styles.chatboxHeaderOption}>
                {headerOptions.map(({ icon: Icon }, index) => (
                  <div key={index} className={styles.chatboxHeaderOptionItem}>
                    <Icon className={styles.chatboxHeaderOptionItemIcon} />
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.chatboxSearch}>
              <Input
                placeholder="Search Messages"
                inputClassName={styles.chatboxSearchInput}
                startIcon={
                  <FiSearch className="absolute left-3 top-[14px] text-color-accent wh-4" />
                }
              />
            </div>

            <div className={styles.chatboxContent}>
              {chatEntries.map((entry, index) => (
                <ChatEntry
                  key={index}
                  entry={entry}
                  onClick={() => handleSelectChatEntry(entry.id)}
                />
              ))}
            </div>
          </div>
        </header>

        <main className={styles.messagingPane}>
          <div className={styles.messagingWrapper}>
            {activeChatId ? <Conversation /> : <EmptyConversation />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Messages;

function getHeaderOptionScheme() {
  return [{ icon: HiOutlineCog }, { icon: LuMailPlus }];
}
