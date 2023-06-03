import { FiSearch } from 'react-icons/fi';
import { HiOutlineCog } from 'react-icons/hi';
import { LuMailPlus } from 'react-icons/lu';

import styles from './messages.layout.module.scss';

import { Input } from '@/components';

export function Messages() {
  const headerOptionScheme = [{ icon: HiOutlineCog }, { icon: LuMailPlus }];

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.mainContent}>
          <header className={styles.chatboxesPane}>
            <div className={styles.chatbox}>
              <div className={styles.chatboxHeader}>
                <h2>Messages</h2>

                <div className={styles.chatboxHeaderOption}>
                  {headerOptionScheme.map(({ icon: Icon }, index) => (
                    <div key={index} className={styles.chatboxHeaderOptionItem}>
                      <Icon className={styles.chatboxHeaderOptionItemIcon} />
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.chatboxSearch}>
                <Input
                  placeholder="Search Messages"
                  inputClassName="pl-9"
                  startIcon={
                    <FiSearch className="storke-2 absolute left-3 top-3 text-color-accent brightness-50 wh-4" />
                  }
                />
              </div>

              <div className={styles.chatboxContent}></div>
            </div>
          </header>

          <main className={styles.messagingPane}>fooo</main>
        </div>

        <div className={styles.warningNotImplementedYet}>
          <span>Not implemented yet</span>
        </div>
      </div>
    </div>
  );
}

export default Messages;
