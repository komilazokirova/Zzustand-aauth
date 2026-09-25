import { type FormEvent, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

type LoginLocationState = {
  from?: {
    pathname?: string
  }
}

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const login = useAuthStore((state) => state.login)
  const accessToken = useAuthStore((state) => state.accessToken)
  const error = useAuthStore((state) => state.error)
  const location = useLocation()
  const state = location.state as LoginLocationState | null
  const destination = state?.from?.pathname || '/profile'

  if (accessToken) {
    return <Navigate to={destination} replace />
  }

  const fillTestCredentials = () => {
    setEmail('john@mail.com')
    setPassword('changeme')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      await login({ email, password })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="login-card">
      <div className="login-header">
        <h2>Tizimga kirish</h2>
        <p>Email va parolingizni kiriting</p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email manzil</label>
          <input
            id="email"
            type="email"
            placeholder="Masalan: john@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <div className="label-with-action">
            <label htmlFor="password">Parol</label>
            <button
              type="button"
              className="toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Yashirish" : "Ko'rsatish"}
            </button>
          </div>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Parolingizni kiriting"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button className="submit-btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Kirilmoqda...' : 'Kirish'}
        </button>

        <button
          type="button"
          className="demo-btn"
          onClick={fillTestCredentials}
        >
          Test ma'lumotlarini to'ldirish
        </button>
      </form>
    </div>
  )
}