import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout'
import Home from './pages/Home'
import About from './pages/About'
import AboutTeam from './pages/AboutTeam'
import Programs from './pages/Programs'
import Pathways from './pages/programs/Pathways'
import Watershed from './pages/programs/Watershed'
import Lgcp from './pages/programs/Lgcp'
import MoBetta from './pages/programs/MoBetta'
import Recreation from './pages/programs/Recreation'
import Cultural from './pages/programs/Cultural'
import Civic from './pages/programs/Civic'
import Impact from './pages/Impact'
import GetInvolved from './pages/GetInvolved'
import Donate from './pages/Donate'
import News from './pages/News'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/about/team" element={<AboutTeam />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/pathways" element={<Pathways />} />
          <Route path="/programs/watershed" element={<Watershed />} />
          <Route path="/programs/lgcp" element={<Lgcp />} />
          <Route path="/programs/mo-betta" element={<MoBetta />} />
          <Route path="/programs/recreation" element={<Recreation />} />
          <Route path="/programs/cultural" element={<Cultural />} />
          <Route path="/programs/civic" element={<Civic />} />
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
