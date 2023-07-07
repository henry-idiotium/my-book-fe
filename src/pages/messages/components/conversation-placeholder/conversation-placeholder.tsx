import { useNavigate } from 'react-router-dom';

import { Button } from '@/components';

import styles from './conversation-placeholder.module.scss';

const indicator = {
  TITLE: 'Select a message',
  DESCRIPTION:
    'Choose from your existing conversations, start a new one, or just keep swimming.',
  NEW_MESSAGE: 'New message',
};

export function ConversationPlaceholder() {
  const navigate = useNavigate();

  const openComposeDialog = () => navigate('compose');

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.indicator}>
          <h1 className={styles.indicatorTitle}>{indicator.TITLE}</h1>

          <span className={styles.indicatorDescription}>
            {indicator.DESCRIPTION}
          </span>
        </div>

        <Button className={styles.newMsg} onClick={openComposeDialog}>
          {indicator.NEW_MESSAGE}
        </Button>
      </div>
    </div>
  );
}

export default ConversationPlaceholder;
