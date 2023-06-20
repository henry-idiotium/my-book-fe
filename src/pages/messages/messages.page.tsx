import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { HiOutlineCog } from 'react-icons/hi';
import { LuMailPlus } from 'react-icons/lu';
import { useNavigate, useParams } from 'react-router-dom';

import { ChatEntry } from './components';
import { useConvoPaneRouteOutlet, useFetchConversations } from './hooks';
import styles from './messages.page.module.scss';

import { usePageMeta } from '@/hooks';
import { classnames } from '@/utils';

const EMPTY_CHAT_ENTRIES_MSG = "It's empty! Let's start a new conversation.";

export function Messages() {
  usePageMeta({ title: 'Messages', auth: { type: 'private' } });

  const navigate = useNavigate();
  const params = useParams();

  const routesOutlets = useConvoPaneRouteOutlet();
  const headerOptions = getHeaderOptionScheme();

  const [{ data: chatEntries }, refetch] = useFetchConversations();

  const [activeConvoId, setActiveConvoId] = useState<string>();

  // watch current acitve convo
  useEffect(() => {
    // not a spread obj 'cause it match * as a parent rather as a child route
    const activeURLConvoId = params['*'];

    setActiveConvoId(activeURLConvoId);
  }, [params]);

  function handleSelectChatEntry(id: string) {
    return () => {
      if (activeConvoId && activeConvoId === id) return;

      navigate(id);
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function reloadEntries() {
    refetch();
  }

  function toggleOnRshMax(className?: string, invert?: boolean) {
    const showConvo = activeConvoId && chatEntries.length;
    const condition = invert || showConvo;
    return classnames(className, { [styles.hideOnRshMax]: condition });
  }

  // todo: on fetch loading, render loading skeleton or a loading animation
  // todo: on fetch error, render a reload/refetch button

  return (
    <section className={styles.container}>
      <section className={toggleOnRshMax(styles.chatEntry, true)}>
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
          <FiSearch className={styles.chatEntrySearchIcon} />
          <input
            placeholder="Search Messages"
            className={styles.chatEntrySearchInput}
          />
        </div>

        <div className={styles.chatEntryContent}>
          {chatEntries.length ? (
            chatEntries.map((entry, index) => (
              <ChatEntry
                key={index}
                entry={entry}
                handleOpenConversation={handleSelectChatEntry(entry.id)}
              />
            ))
          ) : (
            <span className={styles.emptyChatEntriesMsg}>
              {EMPTY_CHAT_ENTRIES_MSG}
            </span>
          )}
        </div>
      </section>

      <section className={toggleOnRshMax(styles.conversation)}>
        {routesOutlets}
      </section>
    </section>
  );
}

export default Messages;

function getHeaderOptionScheme() {
  return [{ icon: HiOutlineCog }, { icon: LuMailPlus }];
}
