import { NavLink } from 'react-router-dom';
import { bottomTabs } from '../../config/navigation';

export function BottomTabBar() {
  return (
    <nav className="bottom-tab-bar" aria-label="安卓端底部导航">
      {bottomTabs.map((tab) => (
        <NavLink key={tab.to} to={tab.to} end={tab.to === '/'}>
          <span aria-hidden="true">{tab.icon}</span>
          <b>{tab.label}</b>
        </NavLink>
      ))}
    </nav>
  );
}
