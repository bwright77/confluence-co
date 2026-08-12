import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'

// AuthProvider wraps the whole app so useAuth works on /login and /admin. It's
// intentionally light: supabase-js is dynamically imported on first use, so the
// marketing pages don't pay for it. (QueryClientProvider is deferred until the
// first data-fetching admin feature lands, to keep it out of the public bundle.)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
