import { FiMail } from 'react-icons/fi';
import { RiHome7Fill } from 'react-icons/ri';

import NavItem, { NavItemProps } from './nav-item/nav-item';

export function NavBar() {
  const navItems: NavItemProps[] = [
    { to: '/home', name: 'home', icon: RiHome7Fill },
    { to: '/messages', name: 'messages', icon: FiMail },
  ];

  return (
    <div className="h-full bg-red-500">
      <div className="px-2">
        <div className="flex flex-col">
          {navItems.map(({ to, name, icon }, index) => (
            <NavItem key={index} icon={icon} name={name} to={to} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default NavBar;
