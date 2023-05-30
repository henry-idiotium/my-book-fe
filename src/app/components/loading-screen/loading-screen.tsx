import loadingMessages from './loading-messages';
import styles from './loading-screen.module.css';

/* eslint-disable-next-line */
export interface LoadingScreenProps {}

export function LoadingScreen(props: LoadingScreenProps) {
  const message = getLoadingMessage();

  return (
    <div className={styles['container']}>
      <h1>{message}</h1>
    </div>
  );
}

export default LoadingScreen;

function getLoadingMessage() {
  const index = Math.floor(Math.random() * loadingMessages.length);
  return loadingMessages[index];
}
