import styles from './loading-screen.module.css';
import loadingMessages from './messages';

/* eslint-disable-next-line */
export interface LoadingScreenProps {}

export function LoadingScreen(props: LoadingScreenProps) {
  const message = getLoadingMessage();

  return (
    <div
      about="foooo"
      aria-checked
      aria-describedby="fooooo"
      className={styles['container']}
      id="fooo"
    >
      <h1>{message}</h1>
    </div>
  );
}

export default LoadingScreen;

function getLoadingMessage() {
  const index = Math.floor(Math.random() * loadingMessages.length);
  return loadingMessages[index];
}
