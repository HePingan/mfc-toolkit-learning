import { NavLink } from 'react-router-dom';
import { modules } from '../../data/modules';
import { toolLinks } from '../../config/navigation';

export function Sidebar() {
  return (
    <aside className="sidebar">
      <details className="mobile-nav-drawer">
        <summary>导航与工具</summary>
        <section className="sidebar-tools" aria-label="常用工具">
          <div className="sidebar-title">常用工具</div>
          <div className="side-tool-grid">
            {toolLinks.map((link) => (
              <NavLink
                className="side-tool-chip"
                to={link.to}
                key={link.to}
                aria-label={link.label}
              >
                <span aria-hidden="true">{link.icon}</span>
                <b>{link.short}</b>
                <em>{link.label}</em>
              </NavLink>
            ))}
          </div>
        </section>
        <div className="sidebar-title module-title">课程模块</div>
        <div className="module-side-list">
          {modules.map((module) => (
            <NavLink key={module.id} className="side-link" to={`/modules/${module.id}`}>
              <span>{module.icon}</span>
              <span>{module.title}</span>
            </NavLink>
          ))}
        </div>
      </details>
    </aside>
  );
}
