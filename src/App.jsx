import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout        from './components/Layout'
import Dashboard     from './pages/Dashboard'
import Inbox         from './pages/Inbox'
import InvoiceDetail from './pages/InvoiceDetail'
import Exceptions    from './pages/Exceptions'
import Batches       from './pages/Batches'
import Camera        from './pages/Camera'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard"   element={<Dashboard />} />
          <Route path="inbox"       element={<Inbox />} />
          <Route path="inbox/:id"   element={<InvoiceDetail />} />
          <Route path="exceptions"  element={<Exceptions />} />
          <Route path="batches"     element={<Batches />} />
          <Route path="camera"      element={<Camera />} />
        </Route>
      </Routes>
    </Router>
  )
}
