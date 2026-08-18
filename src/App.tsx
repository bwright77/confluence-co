import { lazy, Suspense } from 'react'
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
import { ProtectedRoute } from './components/admin/ProtectedRoute'
import { programAreaRedirects } from './routes/redirects'
import { FUNDS } from './lib/donate'

// The OMP admin surface is lazy-loaded so its deps (supabase, lucide,
// react-hook-form, zod) split out of the marketing bundle — they download only
// when a visitor actually reaches /login or /admin.
const Login = lazy(() => import('./pages/Login'))
const AdminLayout = lazy(() =>
  import('./components/admin/AdminLayout').then((m) => ({ default: m.AdminLayout }))
)
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const Opportunities = lazy(() => import('./pages/admin/Opportunities'))
const Settings = lazy(() => import('./pages/admin/Settings'))
const Tasks = lazy(() => import('./pages/admin/Tasks'))
const OpportunityDetail = lazy(() => import('./pages/admin/OpportunityDetail'))
const NewOpportunity = lazy(() => import('./pages/admin/NewOpportunity'))
const EditOpportunity = lazy(() => import('./pages/admin/EditOpportunity'))
const BoardMeetings = lazy(() => import('./pages/admin/BoardMeetings'))
const BoardMeetingNew = lazy(() => import('./pages/admin/BoardMeetingNew'))
const BoardMeetingDetail = lazy(() => import('./pages/admin/BoardMeetingDetail'))

function AdminBoot() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-admin-chrome">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-cc-sage border-t-transparent" />
    </div>
  )
}

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
        {/* OMP admin platform — its own chrome, deliberately outside the
            marketing Layout (no site nav/footer). Lazy-loaded (see above). */}
        <Route
          path="/login"
          element={
            <Suspense fallback={<AdminBoot />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Suspense fallback={<AdminBoot />}>
                <AdminLayout />
              </Suspense>
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <Suspense fallback={<AdminBoot />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="opportunities"
            element={
              <Suspense fallback={<AdminBoot />}>
                <Opportunities />
              </Suspense>
            }
          />
          <Route
            path="opportunities/new"
            element={
              <Suspense fallback={<AdminBoot />}>
                <NewOpportunity />
              </Suspense>
            }
          />
          <Route
            path="opportunities/:id"
            element={
              <Suspense fallback={<AdminBoot />}>
                <OpportunityDetail />
              </Suspense>
            }
          />
          <Route
            path="opportunities/:id/edit"
            element={
              <Suspense fallback={<AdminBoot />}>
                <EditOpportunity />
              </Suspense>
            }
          />
          <Route
            path="tasks"
            element={
              <Suspense fallback={<AdminBoot />}>
                <Tasks />
              </Suspense>
            }
          />
          <Route
            path="settings"
            element={
              <Suspense fallback={<AdminBoot />}>
                <Settings />
              </Suspense>
            }
          />
          <Route
            path="board-meetings"
            element={
              <Suspense fallback={<AdminBoot />}>
                <BoardMeetings />
              </Suspense>
            }
          />
          <Route
            path="board-meetings/new"
            element={
              <Suspense fallback={<AdminBoot />}>
                <BoardMeetingNew />
              </Suspense>
            }
          />
          <Route
            path="board-meetings/:id"
            element={
              <Suspense fallback={<AdminBoot />}>
                <BoardMeetingDetail />
              </Suspense>
            }
          />
        </Route>

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
