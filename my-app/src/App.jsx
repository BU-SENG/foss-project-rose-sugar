import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Auth pages (no sidebar) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Main app layout (sidebar + pages) */}
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
