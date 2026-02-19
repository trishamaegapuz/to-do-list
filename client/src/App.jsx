import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; 
import { useNavigate } from 'react-router-dom';

axios.defaults.withCredentials = true;
const API = 'https://to-do-list-8a22.onrender.com';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true); // Start as loading to check auth
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  // CHECK AUTH STATUS PAGBUKAS NG APP
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API}/api/check-auth`);
        if (res.data.authenticated) {
          navigate('/list');
        }
      } catch (err) {
        console.log("No existing session found.");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isSignup ? `${API}/register` : `${API}/login`;
      const res = await axios.post(url, { username, password });

      if (res.data.success) {
        await Swal.fire({
          icon: 'success',
          title: isSignup ? 'Registration Success!' : 'Welcome Back!',
          timer: 1500,
          showConfirmButton: false,
        });

        if (isSignup) {
          setIsSignup(false);
          setUsername('');
          setPassword('');
        } else {
          // Hard redirect para masiguradong mare-refresh ang cookie state
          window.location.href = '/list'; 
        }
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Failed',
        text: 'Invalid username or password.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !username) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-indigo-400 font-bold">
        SYNCING SESSION...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{isSignup ? 'Create Account' : 'Welcome Back'}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full px-4 py-2 border rounded-lg" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input className="w-full px-4 py-2 border rounded-lg" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold">
            {loading ? 'Processing...' : isSignup ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-sm mt-8">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <span className="text-indigo-600 font-bold cursor-pointer ml-1" onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? 'Login' : 'Sign up'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default App;