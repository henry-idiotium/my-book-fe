import { FiMail } from 'react-icons/fi';
import { RiHome7Fill } from 'react-icons/ri';

import NavItem from './nav-item/nav-item';

export function NavBar() {
  const navItems = {
    home: RiHome7Fill,
    messages: FiMail,
  };

  return (
    <div className="h-full">
      <div className="px-2">
        <div className="flex w-[26px]">
          {Object.entries(navItems).map(([itemName, itemIcon], index) => (
            <NavItem icon={itemIcon} key={index} name={itemName} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default NavBar;
