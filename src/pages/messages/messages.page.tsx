import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { HiOutlineCog } from 'react-icons/hi';
import { LuMailPlus } from 'react-icons/lu';
import { useNavigate, useParams, useRoutes } from 'react-router-dom';

import { ChatEntry, Conversation, EmptyConversation } from './components';
import { useFetchConversations } from './hooks/fetch-convo';
import styles from './messages.page.module.scss';

import { Input } from '@/components';
import { classes } from '@/utils';

export function Messages() {
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

  // todo: on fetch loading, render loading skeleton or a loading animation
  // todo: on fetch error, render a reload/refetch button

  return (
    <section className={styles.container}>
      <section
        className={classes(styles.chatEntry, {
          [styles.hideOnRshMax]: activeConvoId,
        })}
      >
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
          {/* todo: some how make this better */}
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
              onClick={handleSelectChatEntry(entry.id)}
            />
          ))}
        </div>
      </section>

      <section
        className={classes(styles.conversation, {
          [styles.hideOnRshMax]: !activeConvoId,
        })}
      >
        {routesOutlets}
      </section>
    </section>
  );
}

export default Messages;

function getHeaderOptionScheme() {
  return [{ icon: HiOutlineCog }, { icon: LuMailPlus }];
}

function useConvoPaneRouteOutlet() {
  return useRoutes([
    { path: '', Component: EmptyConversation },
    { path: '/:convoId', Component: Conversation },
  ]);
}

// function classes
