import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import Layout from './layouts/Layout'
import Home from './pages/Home'
import About from './pages/About'
import AboutTeam from './pages/AboutTeam'
import Programs from './pages/Programs'
import ProgramDetail from './pages/ProgramDetail'
import ProgramArea from './pages/ProgramArea'
import Impact from './pages/Impact'
import GetInvolved from './pages/GetInvolved'
import Donate from './pages/Donate'
import DonateThankYou from './pages/DonateThankYou'
import News from './pages/News'
import Privacy from './pages/Privacy'
import NotFound from './pages/NotFound'
import { programAreaRedirects } from './routes/redirects'
import { FUNDS } from './lib/donate'

function LegacyAreaRedirect() {
  const { slug } = useParams<{ slug: string }>()
  return <Navigate to={`/program-areas/${slug ?? ''}`} replace />
}

function LegacyProjectRedirect() {
  const { slug } = useParams<{ slug: string }>()
  return <Navigate to={`/projects/${slug ?? ''}`} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/about/team" element={<AboutTeam />} />

          <Route path="/projects" element={<Programs />} />

          {/* Legacy per-area routes redirect to /program-areas/:slug.
              Static paths rank above the /projects/:slug and /programs/:slug params. */}
          {Object.entries(programAreaRedirects).map(([from, to]) => (
            <Route key={from} path={from} element={<Navigate to={to} replace />} />
          ))}

          <Route path="/projects/:slug" element={<ProgramDetail />} />

          {/* Legacy /programs links → /projects */}
          <Route path="/programs" element={<Navigate to="/projects" replace />} />
          <Route path="/programs/:slug" element={<LegacyProjectRedirect />} />

          <Route path="/program-areas/:slug" element={<ProgramArea />} />

          {/* The program-areas index lives on /projects now; old links → /projects */}
          <Route path="/program-areas" element={<Navigate to="/projects" replace />} />

          {/* Legacy /focus-areas links → /program-areas */}
          <Route path="/focus-areas" element={<Navigate to="/program-areas" replace />} />
          <Route path="/focus-areas/:slug" element={<LegacyAreaRedirect />} />

          <Route path="/impact" element={<Impact />} />
          <Route path="/get-involved" element={<GetInvolved />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/donate/thank-you" element={<DonateThankYou />} />

          {/* Designated-fund donate pages, e.g. /donate/kady-youth-sheep-camp.
              Static paths, so they can't collide with /donate/thank-you. */}
          {Object.values(FUNDS).map((fund) => (
            <Route
              key={fund.slug}
              path={`/donate/${fund.slug}`}
              element={<Donate fund={fund} />}
            />
          ))}
          <Route path="/news" element={<News />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Analytics />
    </BrowserRouter>
  )
}
