import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

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

export function AppLayout() {
  const profile = useAuthStore((state) => state.profile)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-shell">
      <header className="navbar">
        <div className="navbar-container">
          <Link className="brand" to="/" aria-label="Bosh sahifa">
            <BrandMark />
            <span>Nexus</span>
          </Link>

          <nav className="navbar-nav">
            <NavLink to="/profile" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              Profil
            </NavLink>
          </nav>

          <div className="navbar-user">
            {profile?.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="user-avatar-small" />
            ) : (
              <span className="user-avatar-small placeholder">
                {profile?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            )}
            <span className="user-name">{profile?.name || 'Foydalanuvchi'}</span>
            <button className="logout-btn" type="button" onClick={handleLogout}>
              Chiqish
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}