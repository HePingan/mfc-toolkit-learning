import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { primaryNavGroups } from '../../config/navigation';

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <div className="brand-block">
        <div className="eyebrow">C++ / MFC Industrial Toolkit</div>
        <h1>MFC 通用工具开发训练营</h1>
      </div>
      <button
        className="mobile-nav-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="site-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true">{open ? '×' : '☰'}</span>
        {open ? '收起菜单' : '功能菜单'}
      </button>
      <nav id="site-navigation" className={`top-nav ${open ? 'open' : ''}`}>
        {primaryNavGroups.map((group) => (
          <div className="nav-group" key={group.label}>
            <span className="nav-group-title">{group.label}</span>
            <div className="nav-group-links">
              {group.links.map((link) => (
                <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)}>
                  {link.text}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </header>
  );
}
