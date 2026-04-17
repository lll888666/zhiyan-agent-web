import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

type HeaderLink = {
  to: string;
  label: string;
};

type UnifiedPageHeaderProps = {
  tag: string;
  title: string;
  subtitle?: string;
  showHomeButton?: boolean;
  links?: HeaderLink[];
  actions?: ReactNode;
};

function UnifiedPageHeader({
  tag,
  title,
  subtitle,
  showHomeButton = true,
  links = [],
  actions,
}: UnifiedPageHeaderProps) {
  return (
    <header className="page-header unified-header">
      <div className="unified-topbar">
        <p className="tag">{tag}</p>
        {showHomeButton ? (
          <Link className="home-btn" to="/">
            返回模块中心首页
          </Link>
        ) : null}
      </div>

      <h1>{title}</h1>
      {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}

      {links.length > 0 ? (
        <nav className="header-nav" aria-label="模块快捷入口">
          {links.map((item) => (
            <Link key={`${item.to}-${item.label}`} className="header-nav-link" to={item.to}>
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}

      {actions ? <div className="header-actions">{actions}</div> : null}
    </header>
  );
}

export default UnifiedPageHeader;
