import { IconBaseProps } from 'react-icons';
import { AiFillHome, AiOutlineHome } from 'react-icons/ai';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import {
  HiOutlineUser,
  HiUser,
  HiOutlineUsers,
  HiUsers,
} from 'react-icons/hi2';
import { LuHash } from 'react-icons/lu';
import {
  RiFileListFill,
  RiFileListLine,
  RiMessage3Fill,
  RiMessage3Line,
} from 'react-icons/ri';
import { TbBell, TbBellFilled } from 'react-icons/tb';
import { Outlet } from 'react-router-dom';

import styles from './root.layout.module.scss';

import { NavBar } from '@/components';
import { NavItemProps } from '@/components/nav-bar/nav-item/nav-item';
import { classes } from '@/utils';

export function Root() {
  const navItems = getNavItems();

  return (
    <section className={styles.container}>
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
    </section>
  );
}
export default Root;

function getNavItems() {
  const navItems: NavItemProps[] = [
    { name: 'home', icon: AiOutlineHome, activeIcon: AiFillHome },
    {
      name: 'explore',
      icon: LuHash,
      activeIcon: (props: IconBaseProps) => (
        <LuHash
          className={classes(props.className, 'storke-[1.5]')}
          {...props}
        />
      ),
    },
    { name: 'notifications', icon: TbBell, activeIcon: TbBellFilled },
    { name: 'friends', icon: HiOutlineUsers, activeIcon: HiUsers },
    { name: 'messages', icon: RiMessage3Line, activeIcon: RiMessage3Fill },
    { name: 'lists', icon: RiFileListLine, activeIcon: RiFileListFill },
    { name: 'bookmarks', icon: FaRegBookmark, activeIcon: FaBookmark },
    { name: 'profile', icon: HiOutlineUser, activeIcon: HiUser },
  ];

  return navItems;
}
