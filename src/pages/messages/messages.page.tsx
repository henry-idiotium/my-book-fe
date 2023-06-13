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
            {activeChatId ? (
              <Conversation id={activeChatId} />
            ) : (
              <EmptyConversation />
            )}
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
