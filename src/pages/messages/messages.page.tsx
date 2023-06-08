import { Button } from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { HiOutlineCog } from 'react-icons/hi';
import { LuMailPlus } from 'react-icons/lu';

import ChatEntry from './chat-entry/chat-entry';
import EmptyConversation from './empty-conversation';
import styles from './messages.page.module.scss';

import { mock } from '@/api/mock';
import { Input } from '@/components';

export function Messages() {
  const headerOptions = getHeaderOptionScheme();

  const [activeChat, setActiveChat] = useState<string>();

  // mock
  const convos = mock.getConvos(7);

  function handleSelectChatEntry(convoId: string) {
    setActiveChat(convoId);
  }

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
              {convos?.map((convo, index) => (
                <ChatEntry
                  key={index}
                  convo={convo}
                  onClick={() => handleSelectChatEntry(convo.id)}
                />
              ))}
            </div>
          </div>
        </header>

        <main className={styles.messagingPane}>
          <div className={styles.messagingWrapper}>
            {activeChat ? <></> : <EmptyConversation />}
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
