import * as Icon from '@phosphor-icons/react';
import { Outlet } from 'react-router-dom';

import { NavBar } from './nav-bar/nav-bar';
import { NavItemProps } from './nav-bar/nav-item/nav-item';
import styles from './root.layout.module.scss';

export function Root() {
  const navItems = getNavItems();

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <nav className={styles.nav}>
          <div className={styles.navWrapper}>
            <NavBar scheme={navItems} />
          </div>
        </nav>

        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
export default Root;

function getNavItems() {
  const navItems: NavItemProps[] = [
    { name: 'home', icon: Icon.House },
    { name: 'explore', icon: Icon.Binoculars },
    { name: 'notifications', icon: Icon.Bell },
    { name: 'messages', icon: Icon.ChatTeardropDots },
    { name: 'friends', icon: Icon.Users },
    { name: 'bookmarks', icon: Icon.BookmarkSimple },
    { name: 'profile', icon: Icon.UserCircle },
  ];

  return navItems;
}
