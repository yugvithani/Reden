import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm.jsx';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (user) => {
    navigate('/home', { state: { user } });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-md">
        <LoginForm onLoginSuccess={handleLoginSuccess} />
        <p className="mt-4 text-center text-gray-600">
          Haven't an account? <Link to="/signup" className="text-blue-500 hover:underline">Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
