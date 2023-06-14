import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { HiOutlineCog } from 'react-icons/hi';
import { LuMailPlus } from 'react-icons/lu';

import { ChatEntry, Conversation, EmptyConversation } from './components';
import { useFetchConversations } from './hooks/fetch-convo';
import styles from './messages.page.module.scss';

import { Input, LoadingScreen } from '@/components';

export function Messages() {
  const [
    { data: chatEntries, errors: fetchError, loadings: fetchLoading },
    refetch,
  ] = useFetchConversations();

  const [activeChatId, setActiveChatId] = useState<string>();

  const headerOptions = getHeaderOptionScheme();

  function handleSelectChatEntry(convoId: string) {
    setActiveChatId(convoId);
    // more...
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function reloadEntries() {
    refetch();
  }

  if (fetchLoading) return <LoadingScreen />;

  if (fetchError.length) return <div className="text-lg">Fetch Error</div>;

  return (
    <section className={styles.container}>
      <section className={styles.chatEntry}>
        <div className={styles.chatEntryHeader}>
          <h2>Messages</h2>

          <div className={styles.chatEntryHeaderOption}>
            {headerOptions.map(({ icon: Icon }, index) => (
              <div key={index} className={styles.chatEntryHeaderOptionItem}>
                <Icon className={styles.chatEntryHeaderOptionItemIcon} />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.chatEntrySearch}>
          <Input
            placeholder="Search Messages"
            inputClass={styles.chatEntrySearchInput}
            startIcon={
              <FiSearch className="absolute left-3 top-[12px] text-color-accent wh-4" />
            }
          />
        </div>

        <div className={styles.chatEntryContent}>
          {chatEntries.map((entry, index) => (
            <ChatEntry
              key={index}
              entry={entry}
              onClick={() => handleSelectChatEntry(entry.id)}
            />
          ))}
        </div>
      </section>

      <section className={styles.conversation}>
        {activeChatId ? (
          <Conversation id={activeChatId} />
        ) : (
          <EmptyConversation />
        )}
      </section>
    </section>
  );
}

export default Messages;

function getHeaderOptionScheme() {
  return [{ icon: HiOutlineCog }, { icon: LuMailPlus }];
}
