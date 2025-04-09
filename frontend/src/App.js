import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import Dashboard from "./components/Dashboard";
import ForgotPassword from './components/ForgotPassword';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ResetPassword from './components/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import DemoPageContent from './components/DemoPageContent';
import EditTaskForm from './pages/EditTaskForm';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute>}/>
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/dash" element={<DemoPageContent />} />
          <Route path="/tasks/edit/:id" element={<EditTaskForm />} />


        </Routes>
      </div>
    </Router>
  );
}

export default App;