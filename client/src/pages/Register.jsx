import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const API = 'https://to-do-list-8a22.onrender.com';

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirm) return Swal.fire('Error', 'Passwords do not match!', 'error');

    setLoading(true);
    try {
      const response = await axios.post(`${API}/register`, { username, password });
      if (response.data.success) {
        await Swal.fire('Success', 'Account Created!', 'success');
        navigate('/');
      }
    } catch (error) {
      Swal.fire('Error', 'Registration Failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <input className="w-full p-2 border rounded" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input className="w-full p-2 border rounded" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <input className="w-full p-2 border rounded" type="password" placeholder="Confirm" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          <button className="w-full bg-pink-600 text-white py-2 rounded" disabled={loading}>{loading ? 'Saving...' : 'Register'}</button>
        </form>
      </div>
    </div>
  );
}
export default Register;