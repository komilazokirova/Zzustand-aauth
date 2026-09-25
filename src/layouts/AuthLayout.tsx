import { Link, Outlet } from 'react-router-dom'

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
        <path d="M8 8.5h16v15H8z" stroke="currentColor" strokeWidth="2.2" />
        <path d="m11 17 3-3 3.2 3.2L21 13.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

export function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-card-wrap">
        <div className="auth-logo">
          <Link className="brand" to="/" aria-label="Bosh sahifa">
            <BrandMark />
            <span>Nexus</span>
          </Link>
        </div>
        <Outlet />
      </div>
    </div>
  )
}