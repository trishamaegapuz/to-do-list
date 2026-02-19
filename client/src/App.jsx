import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; 
import { useNavigate } from 'react-router-dom';

// REQUIRED: Para ipadala ang credentials (cookies) sa bawat request
axios.defaults.withCredentials = true;

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const API = 'https://to-do-list-8a22.onrender.com';
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isSignup ? `${API}/register` : `${API}/login`;
      const payload = { username, password };

      const res = await axios.post(url, payload);

      if (res.data.success) {
        if (isSignup) {
          await Swal.fire({
            icon: 'success',
            title: 'Registration Success!',
            text: 'You can now log in.',
            timer: 2000,
            showConfirmButton: false,
          });
          setIsSignup(false);
          setUsername('');
          setPassword('');
        } else {
          // LOGIN SUCCESS
          await Swal.fire({
            icon: 'success',
            title: 'Welcome Back!',
            text: 'Redirecting to your workspace...',
            timer: 1500,
            showConfirmButton: false,
          });
          
          // Mas mainam gamitin ang navigate('/list') pero kung ayaw pa rin, 
          // gamitin ang: window.location.href = '/list';
          navigate('/list');
        }
      }
    } catch (err) {
      console.error('ERROR:', err);
      const msg = err.response?.data?.message || 'Maling username o password.';
      Swal.fire({
        icon: 'error',
        title: 'Authentication Failed',
        text: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-bold bg-indigo-600 hover:bg-indigo-700 transition"
          >
            {loading ? 'Wait...' : isSignup ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-8">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <span
            className="text-indigo-600 font-bold cursor-pointer ml-1 hover:underline"
            onClick={() => !loading && setIsSignup(!isSignup)}
          >
            {isSignup ? 'Login' : 'Sign up'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default App;