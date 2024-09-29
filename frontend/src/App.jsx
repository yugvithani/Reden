import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProtectRoute from './shared/ProtectRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={
          <ProtectRoute>
            <HomePage />
          </ProtectRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
