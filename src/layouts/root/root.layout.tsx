import { AiFillHome, AiOutlineHome } from 'react-icons/ai';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { HiOutlineUser, HiOutlineUsers, HiUser, HiUsers } from 'react-icons/hi2';
import {
  RiFileListFill,
  RiFileListLine,
  RiMessage3Fill,
  RiMessage3Line,
  RiSearchFill,
  RiSearchLine,
} from 'react-icons/ri';
import { TbBell, TbBellFilled } from 'react-icons/tb';
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
    { name: 'home', icon: AiOutlineHome, activeIcon: AiFillHome },
    { name: 'explore', icon: RiSearchLine, activeIcon: RiSearchFill },
    { name: 'notifications', icon: TbBell, activeIcon: TbBellFilled },
    { name: 'messages', icon: RiMessage3Line, activeIcon: RiMessage3Fill },
    {
      name: 'friends',
      icon: HiOutlineUsers,
      activeIcon: HiUsers,
      iconClassName: { nonActive: 'stroke-[1.9]' },
    },
    { name: 'lists', icon: RiFileListLine, activeIcon: RiFileListFill },
    { name: 'bookmarks', icon: FaRegBookmark, activeIcon: FaBookmark },
    {
      name: 'profile',
      icon: HiOutlineUser,
      activeIcon: HiUser,
      iconClassName: { nonActive: 'stroke-[1.9]' },
    },
  ];

  return navItems;
}
