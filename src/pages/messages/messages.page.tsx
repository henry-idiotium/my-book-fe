import * as Icon from '@phosphor-icons/react';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';

import { Loading } from '@/components';
import { classnames, contextWithZod } from '@/utils';

import { ChatEntry } from './components';
import { useConversationRouteOutlet, useFetchChatEntries } from './hooks';
import styles from './messages.page.module.scss';

const EMPTY_ENTRIES_MSG = "It's empty! Let's start a new conversation.";

export const MessageCascadeStateContext = contextWithZod({
  reloadEntries: z.function().returns(z.void()),
});

export function Messages() {
  const navigate = useNavigate();
  const params = useParams();

  const routesOutlets = useConversationRouteOutlet();
  const headerOptions = getHeaderOptionScheme();

  const [chatEntryState, reloadEntries] = useFetchChatEntries();

  // `*` is the current match to this compose POV.
  const activeConvoId = useMemo(() => params['*'] ?? '', [params]);

  const handleSelectChatEntry = (id: string) => () => {
    if (activeConvoId !== id) navigate(id);
  };

  function toggleOnRshMaxClassNames(className?: string, isEntryPane = true) {
    const entryShouldHide = !chatEntryState.entries.length || activeConvoId;
    const shouldAdd = isEntryPane ? entryShouldHide : !entryShouldHide;
    return classnames(className, { [styles.hideOnRshMax]: shouldAdd });
  }

  // todo: on fetch loading, render loading skeleton or a loading animation
  // todo: on fetch error, render a reload/refetch button
  // todo: create a layout cmp for division of two panel

  if (chatEntryState.loading) {
    return (
      <div className="absolute left-16 flex items-center justify-center wh-full">
        <Loading />
      </div>
    );
  }

  if (chatEntryState.error.paired || chatEntryState.error.group) return <>Error...!!</>;

  return (
    <MessageCascadeStateContext.Provider value={{ reloadEntries }}>
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
            <Icon.MagnifyingGlass className={styles.chatEntrySearchIcon} />
            <input placeholder="Search Messages" className={styles.chatEntrySearchInput} />
          </div>

          <div className={styles.chatEntryContent}>
            {chatEntryState.entries.length ? (
              chatEntryState.entries.map((entry, index) => (
                <ChatEntry
                  key={index}
                  entry={entry}
                  isActive={activeConvoId === entry.id}
                  openConvo={handleSelectChatEntry(entry.id)}
                />
              ))
            ) : (
              <span className={styles.emptyChatEntriesMsg}>{EMPTY_ENTRIES_MSG}</span>
            )}
          </div>
        </section>

        <section className={toggleOnRshMaxClassNames(styles.conversation, false)}>
          {routesOutlets}
        </section>
      </div>
    </MessageCascadeStateContext.Provider>
  );
}

export default Messages;

function getHeaderOptionScheme() {
  return [{ icon: Icon.GearSix }, { icon: Icon.EnvelopeSimple }];
}
