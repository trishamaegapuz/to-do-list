import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; 
import { useNavigate } from 'react-router-dom';

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
          navigate('/list');
        } else {
          Swal.fire('Success', 'Registered! Please login.', 'success');
          setIsSignup(false);
        }
      }
    } catch (err) {
      Swal.fire('Error', 'Invalid credentials or Server is waking up.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl text-gray-800">
        <h1 className="text-3xl font-bold text-center mb-6">{isSignup ? 'Register' : 'Login'}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full px-4 py-2 border rounded-lg" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input className="w-full px-4 py-2 border rounded-lg" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold" disabled={loading}>
            {loading ? 'Processing...' : isSignup ? 'Sign Up' : 'Log In'}
          </button>
        </form>
        <p className="text-center mt-6 cursor-pointer text-indigo-600 font-bold" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up"}
        </p>
      </div>
    </div>
  );
}
export default App;