import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API = 'https://to-do-list-8a22.onrender.com';
axios.defaults.withCredentials = true;

function List() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLists = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/list`);
      if (Array.isArray(res.data)) setLists(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { fetchLists(); }, [fetchLists]);

  const handleLogout = async () => {
    await axios.post(`${API}/logout`);
    window.location.href = '/';
  };

  const handleAdd = async () => {
    const { value: title } = await Swal.fire({
      title: 'New List',
      input: 'text',
      showCancelButton: true,
      confirmButtonColor: '#6366f1'
    });
    if (title) {
      await axios.post(`${API}/api/list`, { title });
      fetchLists();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0f172a] text-white">
      <Header />
      <main className="flex-grow p-6">
        <div className="max-w-2xl mx-auto">
          <button onClick={handleLogout} className="mb-6 text-xs text-slate-500 font-bold uppercase tracking-widest hover:text-red-400">← Logout</button>
          <h1 className="text-4xl font-black mb-8 text-center">My Workspace</h1>
          
          <div className="grid gap-4">
            {loading ? (
              <p className="text-center text-indigo-400">Loading Workspace...</p>
            ) : lists.length === 0 ? (
              <div className="text-center p-10 border border-dashed border-slate-800 rounded-3xl">Empty Workspace</div>
            ) : (
              lists.map((l) => (
                <div key={l.id} onClick={() => navigate(`/details/${l.id}`, { state: { title: l.title } })} className="p-6 bg-slate-800/40 border border-slate-800 rounded-[2rem] flex justify-between items-center cursor-pointer hover:border-indigo-500 transition-all">
                  <span className="text-xl font-bold">{l.title}</span>
                  <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); /* edit logic */ }} className="p-2">✏️</button>
                    <button onClick={(e) => { e.stopPropagation(); /* delete logic */ }} className="p-2">🗑️</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <button onClick={handleAdd} className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-indigo-600 px-10 py-4 rounded-2xl font-bold shadow-2xl">+ New List</button>
      <Footer />
    </div>
  );
}
export default List;