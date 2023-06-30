import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { HiOutlineCog } from 'react-icons/hi';
import { LuMailPlus } from 'react-icons/lu';
import { useNavigate, useParams } from 'react-router-dom';

import { ChatEntry } from './components';
import { useConversationRouteOutlet, useFetchChats } from './hooks';
import styles from './messages.page.module.scss';

import { PageMeta } from '@/components';
import { classnames } from '@/utils';

const EMPTY_CHAT_ENTRIES_MSG = "It's empty! Let's start a new conversation.";

export function Messages() {
  const navigate = useNavigate();
  const params = useParams();

  const routesOutlets = useConversationRouteOutlet();
  const headerOptions = getHeaderOptionScheme();

  const [{ chatEntries, chatEntriesLoading, chatEntriesErrors }, refetch] =
    useFetchChats();
  // const chatEntries: MessageEntity[] = [];

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

  function toggleOnRshMaxClassNames(className?: string, isEntryPane = true) {
    const entryShouldHide = !chatEntries.length || activeConvoId;
    const shouldAdd = isEntryPane ? entryShouldHide : !entryShouldHide;

    return classnames(className, { [styles.hideOnRshMax]: shouldAdd });
  }

  // todo: on fetch loading, render loading skeleton or a loading animation
  // todo: on fetch error, render a reload/refetch button
  // todo: create a layout cmp for division of two panel

  if (chatEntriesLoading) return <div>loading ...</div>;
  if (chatEntriesErrors.length) return <div>something went wrong!!</div>;

  return (
    <PageMeta title="Messages" auth={{ type: 'private' }}>
      <div className={styles.container}>
        <section className={toggleOnRshMaxClassNames(styles.chatEntry)}>
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
                  openConvo={handleSelectChatEntry(entry.id)}
                />
              ))
            ) : (
              <span className={styles.emptyChatEntriesMsg}>
                {EMPTY_CHAT_ENTRIES_MSG}
              </span>
            )}
          </div>
        </section>

        <section
          className={toggleOnRshMaxClassNames(styles.conversation, false)}
        >
          {routesOutlets}
        </section>
      </div>
    </PageMeta>
  );
}

export default Messages;

function getHeaderOptionScheme() {
  return [{ icon: HiOutlineCog }, { icon: LuMailPlus }];
}
