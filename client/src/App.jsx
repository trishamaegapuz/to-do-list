import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; 
import { useNavigate } from 'react-router-dom';

// Napakahalaga: Dapat nasa labas ito
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
          await Swal.fire({
            icon: 'success',
            title: 'Welcome Back!',
            timer: 1500,
            showConfirmButton: false,
          });
          // Gumamit ng window.location.href kung ayaw gumana ng navigate
          // para masiguro ang hard refresh ng session
          window.location.href = '/list'; 
        } else {
          // SIGNUP SUCCESS
          await Swal.fire({ icon: 'success', title: 'Registered!', timer: 1500 });
          setIsSignup(false);
        }
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.message || 'Connection Error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">{isSignup ? 'Sign Up' : 'Login'}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full p-2 border rounded" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
          <input className="w-full p-2 border rounded" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button className="w-full bg-indigo-600 text-white p-3 rounded font-bold" disabled={loading}>
            {loading ? 'Wait...' : (isSignup ? 'Create Account' : 'Log In')}
          </button>
        </form>
        <p className="text-center mt-4 cursor-pointer text-indigo-600" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up"}
        </p>
      </div>
    </div>
  );
}

export default App;