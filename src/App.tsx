import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './layouts/Layout'
import Home from './pages/Home'
import About from './pages/About'
import AboutTeam from './pages/AboutTeam'
import Programs from './pages/Programs'
import ProgramDetail from './pages/ProgramDetail'
import FocusArea from './pages/FocusArea'
import FocusAreas from './pages/FocusAreas'
import Impact from './pages/Impact'
import GetInvolved from './pages/GetInvolved'
import Donate from './pages/Donate'
import News from './pages/News'
import NotFound from './pages/NotFound'
import { programAreaRedirects } from './routes/redirects'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/about/team" element={<AboutTeam />} />

          <Route path="/programs" element={<Programs />} />

          {/* Legacy per-area routes redirect to /focus-areas/:slug.
              Defined before /programs/:slug so they take precedence. */}
          {Object.entries(programAreaRedirects).map(([from, to]) => (
            <Route key={from} path={from} element={<Navigate to={to} replace />} />
          ))}

          <Route path="/programs/:slug" element={<ProgramDetail />} />

          <Route path="/focus-areas" element={<FocusAreas />} />
          <Route path="/focus-areas/:slug" element={<FocusArea />} />

          <Route path="/impact" element={<Impact />} />
          <Route path="/get-involved" element={<GetInvolved />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/news" element={<News />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
