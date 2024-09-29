import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Home = () => {
  const location = useLocation();
  const { user } = location.state || {};
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/login');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md text-center">
        <h2 className="text-3xl font-semibold">Welcome, {user?.username}</h2>
        <button onClick={handleLogout} className="mt-6 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Home;
