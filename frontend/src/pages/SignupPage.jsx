import { useNavigate } from 'react-router-dom';
import SignupForm from '../components/SignupForm.jsx';
import { Link } from 'react-router-dom';

const SignupPage = () => {
    const navigate = useNavigate();

    const handleSignupSuccess = () => {
        navigate('/login');
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md">
                <SignupForm onSignupSuccess={handleSignupSuccess} />
                <p className="mt-4 text-center text-gray-600">
                    Have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;