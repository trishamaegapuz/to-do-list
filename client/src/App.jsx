import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; 
import { useNavigate } from 'react-router-dom';

// Napakahalaga: Para ma-send ang session cookies
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
        if (!isSignup) {
          // Kapag login success, lipat agad sa list
          // Mas mainam na wag nang patagalin ang Swal timer para mabilis ang redirect
          await Swal.fire({
            icon: 'success',
            title: 'Welcome Back!',
            text: 'Redirecting...',
            timer: 1000,
            showConfirmButton: false,
          });
          navigate('/list');
        } else {
          await Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Account created. Please log in.',
            timer: 2000,
            showConfirmButton: false,
          });
          setIsSignup(false);
          setUsername('');
          setPassword('');
        }
      }
    } catch (err) {
      console.error('ERROR:', err);
      Swal.fire({
        icon: 'error',
        title: 'Authentication Failed',
        text: err.response?.data?.message || 'Maling username o password.',
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
          <p className="text-gray-500 text-sm mt-2">
            {isSignup ? 'Register to start your tasks' : 'Please log in to your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Username</label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-bold text-lg shadow-lg transition-all transform active:scale-95 ${
              loading
                ? 'bg-indigo-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/50'
            }`}
          >
            {loading ? 'Connecting...' : isSignup ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-8">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <span
            className="text-indigo-600 font-bold cursor-pointer ml-1 hover:underline"
            onClick={() => {
              if (!loading) {
                setIsSignup(!isSignup);
                setUsername('');
                setPassword('');
              }
            }}
          >
            {isSignup ? 'Login' : 'Sign up'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default App;