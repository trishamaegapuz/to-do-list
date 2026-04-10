import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

// Siguraduhin na ito ay nasa labas ng component
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
      const res = await axios.post(url, { username, password });

      if (res.data.success) {
        if (!isSignup) {
          // LOGIN SUCCESS
          // Maaari kang mag-save ng konting info sa localStorage para sa UI bilis
          localStorage.setItem('isLoggedIn', 'true');

          // Maghintay ng sandali bago mag-navigate para sigurado ang cookie
          setTimeout(() => {
            navigate('/list');
          }, 100);
        } else {
          // REGISTER SUCCESS
          await Swal.fire({
            icon: 'success',
            title: 'Account Created',
            text: 'You can now log in!',
            confirmButtonColor: '#4f46e5'
          });
          setIsSignup(false);
          setUsername('');
          setPassword('');
        }
      }
    } catch (err) {
      console.error("Auth Error:", err);
      Swal.fire({
        icon: 'error',
        title: 'Authentication Failed',
        text: err.response?.data?.message || 'Check your connection or credentials.',
        confirmButtonColor: '#4f46e5'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#4f46e5] via-[#a855f7] to-[#ec4899] p-4">
      {/* Ginamit ang iyong White Card UI mula sa screenshot */}
      <div className="bg-white w-full max-w-[440px] p-10 rounded-2xl shadow-2xl text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-1">
          {isSignup ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p className="text-slate-500 text-xs mb-8 uppercase tracking-widest font-semibold">
          Faculty Consultation System
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1 ml-1">Username</label>
            <input
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1 ml-1">Password</label>
            <input
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isSignup ? "new-password" : "current-password"}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Processing...' : isSignup ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-slate-500">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <span
            className="ml-1 text-indigo-600 font-bold cursor-pointer hover:underline"
            onClick={() => {
              setIsSignup(!isSignup);
              setUsername('');
              setPassword('');
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