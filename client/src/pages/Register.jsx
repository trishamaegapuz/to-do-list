import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      return Swal.fire('Error', 'Passwords do not match', 'error');
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API}/register`, {
        username,
        password
      });

      if (res.data.success) {
        await Swal.fire('Success', 'Account created', 'success');
        navigate('/');
      }
    } catch (err) {
      Swal.fire('Error', 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="p-6 max-w-md mx-auto">
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
      />
      <button disabled={loading}>
        {loading ? 'Creating...' : 'Register'}
      </button>
    </form>
  );
}

export default Register;
