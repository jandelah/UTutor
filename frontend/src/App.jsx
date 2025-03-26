import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/common/Layout';

// Páginas autenticadas
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Mentorships from './pages/Mentorships';
import Sessions from './pages/Sessions';
import Resources from './pages/Resources';
import Profile from './pages/Profile';

// Páginas públicas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import NotFound from './pages/NotFound';

// Mock de autenticación (reemplazar con contexto real)
const isAuthenticated = false;

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/login" element={<Layout><Login /></Layout>} />
      <Route path="/register" element={<Layout><Register /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      
      {/* Rutas protegidas */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/search" 
        element={
          <ProtectedRoute>
            <Layout><Search /></Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/mentorships" 
        element={
          <ProtectedRoute>
            <Layout><Mentorships /></Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/sessions" 
        element={
          <ProtectedRoute>
            <Layout><Sessions /></Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/resources" 
        element={
          <ProtectedRoute>
            <Layout><Resources /></Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Layout><Profile /></Layout>
          </ProtectedRoute>
        } 
      />
      
      {/* Ruta 404 */}
      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
  );
}

export default App;