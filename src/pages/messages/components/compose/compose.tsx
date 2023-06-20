import ComposeDialog from './compose-dialog/compose-dialog';
import styles from './compose.module.scss';

import { Button } from '@/components';

const indicator = {
  TITLE: 'Select a message',
  DESCRIPTION:
    'Choose from your existing conversations, start a new one, or just keep swimming.',
  NEW_MESSAGE: 'New message',
};

export function Compose() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.indicator}>
          <h1 className={styles.indicatorTitle}>{indicator.TITLE}</h1>

          <span className={styles.indicatorDescription}>
            {indicator.DESCRIPTION}
          </span>
        </div>

        <ComposeDialog>
          <Button className={styles.newMsg}>{indicator.NEW_MESSAGE}</Button>
        </ComposeDialog>
      </div>
    </div>
  );
}

export default Compose;
