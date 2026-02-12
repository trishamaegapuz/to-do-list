import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API = 'https://to-do-list-8a22.onrender.com';
axios.defaults.withCredentials = true;

function Details() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API}/api/items/${id}`);
      setItems(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [id]);

  const handleAddItem = async () => {
    const { value: desc } = await Swal.fire({
      title: 'Add Task',
      input: 'text',
      inputPlaceholder: 'What needs to be done?',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      background: '#1e293b',
      color: '#fff'
    });
    if (desc) {
      try {
        await axios.post(`${API}/api/items`, { list_id: id, description: desc, status: 'pending' });
        fetchItems();
      } catch (err) {
        if (err.response?.status === 401) navigate('/');
      }
    }
  };

  const toggleStatus = async (itemId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
      await axios.put(`${API}/api/items/${itemId}`, { status: newStatus });
      fetchItems();
    } catch (err) {
      if (err.response?.status === 401) navigate('/');
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await axios.delete(`${API}/api/items/${itemId}`);
      fetchItems();
    } catch (err) {
      if (err.response?.status === 401) navigate('/');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0f172a] text-slate-200">
      <Header />
      <main className="flex-grow p-6 pb-32">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => navigate('/list')} className="mb-8 text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:text-indigo-400">
            ← Back to Lists
          </button>

          <div className="mb-10">
            <h2 className="text-4xl font-black text-white tracking-tighter">{state?.title || 'Tasks'}</h2>
            <p className="text-slate-500 text-sm italic">Manage your specific objectives</p>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-10 text-indigo-400 animate-spin">⌛</div>
            ) : items.length === 0 ? (
              <div className="text-center py-10 bg-slate-800/10 rounded-3xl border border-slate-800 text-slate-600 italic">No tasks yet.</div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-slate-800/30 p-5 rounded-2xl border border-slate-800 group hover:border-slate-600 transition-all">
                  <input 
                    type="checkbox" 
                    checked={item.status === 'completed'} 
                    onChange={() => toggleStatus(item.id, item.status)}
                    className="w-5 h-5 rounded-lg border-slate-700 bg-slate-900 checked:bg-indigo-600 transition-all cursor-pointer"
                  />
                  <span className={`flex-grow font-medium ${item.status === 'completed' ? 'line-through text-slate-600' : 'text-slate-200'}`}>
                    {item.description}
                  </span>
                  <button onClick={() => deleteItem(item.id)} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 rounded-lg text-red-500 transition-all">
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xs px-6">
        <button onClick={handleAddItem} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-indigo-500 transition-all uppercase text-xs tracking-widest">
          + Add New Task
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default Details;