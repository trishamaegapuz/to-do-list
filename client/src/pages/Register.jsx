import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
=======
import { useNavigate } from 'react-router-dom'; // Para makabalik sa login page

function Register() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const API_URL = 'http://localhost:3000';
>>>>>>> d8111a500d3bd1ceaad0fd21c8004c1ecf3e5709

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
<<<<<<< HEAD
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
=======
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Passwords do not match!',
        confirmButtonColor: '#4f46e5',
      });
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/register`, {
        name: name,
        password: password,
        confirm: confirm
      });

      if (response.data.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Account Created!',
          text: 'You have registered successfully.',
          timer: 2000,
          showConfirmButton: false
        });
        navigate('/'); // I-redirect ang user sa Login page (App.jsx)
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.response?.data?.message || "Something went wrong",
        confirmButtonColor: '#ef4444',
      });
>>>>>>> d8111a500d3bd1ceaad0fd21c8004c1ecf3e5709
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
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
=======
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Sign Up</h1>
          <p className="text-gray-500 text-sm mt-2">Faculty Consultation System</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Username</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Choose a username"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Confirm Password</label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-type password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-bold text-lg shadow-lg transition-all ${
              loading ? 'bg-pink-300' : 'bg-pink-600 hover:bg-pink-700 shadow-pink-500/50'
            }`}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account? 
          <span 
            className="text-indigo-600 font-bold cursor-pointer hover:underline ml-1"
            onClick={() => navigate('/')}
          >
            Log In
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
>>>>>>> d8111a500d3bd1ceaad0fd21c8004c1ecf3e5709
