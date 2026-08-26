import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RequireAuth, RequireAdmin, RequireSeller } from './components/RouteGuards';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import PendingApproval from './pages/PendingApproval';
import CategoryGrid from './pages/CategoryGrid';
import CategoryListing from './pages/CategoryListing';
import SellerDetail from './pages/SellerDetail';
import BecomeSeller from './pages/BecomeSeller';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pending" element={<PendingApproval />} />

          <Route path="/home" element={<RequireAuth><CategoryGrid /></RequireAuth>} />
          <Route path="/category/:name" element={<RequireAuth><CategoryListing /></RequireAuth>} />
          <Route path="/seller/:id" element={<RequireAuth><SellerDetail /></RequireAuth>} />
          <Route path="/sell" element={<RequireSeller><BecomeSeller /></RequireSeller>} />

          <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
