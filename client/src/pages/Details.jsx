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
      if (err.response?.status === 401) navigate('/');
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
      cancelButtonColor: '#475569',
      background: '#1e293b',
      color: '#fff',
      customClass: {
        popup: 'rounded-[2rem] border border-slate-700'
      }
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

  const handleEditItem = async (itemId, oldDesc) => {
    const { value: newDesc } = await Swal.fire({
      title: 'Edit Task',
      input: 'text',
      inputValue: oldDesc,
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#475569',
      background: '#1e293b',
      color: '#fff',
      customClass: {
        popup: 'rounded-[2rem] border border-slate-700'
      }
    });
    if (newDesc && newDesc !== oldDesc) {
      try {
        await axios.put(`${API}/api/items/${itemId}`, { description: newDesc });
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
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#475569',
      confirmButtonText: 'Yes, delete it!',
      background: '#1e293b',
      color: '#fff',
      customClass: {
        popup: 'rounded-[2rem] border border-slate-700'
      }
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API}/api/items/${itemId}`);
        fetchItems();
        Swal.fire({
          title: 'Deleted!',
          text: 'Your task has been removed.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: '#1e293b',
          color: '#fff',
          customClass: { popup: 'rounded-[2rem] border border-slate-700' }
        });
      } catch (err) {
        if (err.response?.status === 401) navigate('/');
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0f172a] text-slate-200">
      <Header />
      <main className="flex-grow p-6 pb-32">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => navigate('/list')} className="mb-8 text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:text-indigo-400 transition-colors">
            ← Back to Lists
          </button>

          <div className="mb-10">
            <h2 className="text-4xl font-black text-white tracking-tighter">{state?.title || 'Tasks'}</h2>
            <p className="text-slate-500 text-sm italic">Manage your specific objectives</p>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Loading Tasks</p>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-10 bg-slate-800/10 rounded-3xl border border-slate-800 text-slate-600 italic">No tasks yet.</div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-slate-800/30 p-5 rounded-2xl border border-slate-800 group hover:border-slate-600 transition-all">
                  <input 
                    type="checkbox" 
                    checked={item.status === 'completed'} 
                    onChange={() => toggleStatus(item.id, item.status)}
                    className="w-5 h-5 rounded-lg border-slate-700 bg-slate-900 checked:bg-indigo-600 transition-all cursor-pointer accent-indigo-500"
                  />
                  <span className={`flex-grow font-medium transition-all ${item.status === 'completed' ? 'line-through text-slate-600' : 'text-slate-200'}`}>
                    {item.description}
                  </span>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => handleEditItem(item.id, item.description)} className="p-2 hover:bg-indigo-500/10 rounded-lg text-slate-400 hover:text-indigo-400 transition-all">
                      ✏️
                    </button>
                    <button onClick={() => deleteItem(item.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-500 transition-all">
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xs px-6">
        <button onClick={handleAddItem} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-indigo-500 transition-all uppercase text-xs tracking-widest active:scale-95">
          + Add New Task
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default Details;