import { useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'

export function ProfilePage() {
  const profile = useAuthStore((state) => state.profile)
  const fetchProfile = useAuthStore((state) => state.fetchProfile)
  const error = useAuthStore((state) => state.error)
  const isLoading = useAuthStore((state) => state.isLoading)

  useEffect(() => {
    if (!profile) {
      void fetchProfile()
    }
  }, [fetchProfile, profile])

  if (isLoading && !profile) {
    return (
      <div className="profile-container">
        <div className="loading-card">Profil yuklanmoqda...</div>
      </div>
    )
  }

  if (error && !profile) {
    return (
      <div className="profile-container">
        <div className="error-card">
          <p>Xatolik: {error}</p>
          <button type="button" onClick={() => void fetchProfile()} className="retry-btn">
            Qayta urinish
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-top">
          {profile?.avatar ? (
            <img src={profile.avatar} alt={profile.name} className="profile-avatar" />
          ) : (
            <div className="profile-avatar placeholder">
              {profile?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <div className="profile-main-info">
            <h2>{profile?.name}</h2>
            <p className="profile-email">{profile?.email}</p>
            <span className="role-tag">{profile?.role}</span>
          </div>
        </div>

        <div className="profile-rows">
          <div className="profile-row">
            <span className="row-label">Foydalanuvchi ID</span>
            <span className="row-value">#{profile?.id}</span>
          </div>
          <div className="profile-row">
            <span className="row-label">Email</span>
            <span className="row-value">{profile?.email}</span>
          </div>
          <div className="profile-row">
            <span className="row-label">Rol</span>
            <span className="row-value" style={{ textTransform: 'capitalize' }}>{profile?.role}</span>
          </div>
        </div>
      </div>
    </div>
  )
}