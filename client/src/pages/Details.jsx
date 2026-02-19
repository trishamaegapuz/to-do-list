import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, [id]);

  const handleAdd = async () => {
    const { value: desc } = await Swal.fire({
      title: 'New Task',
      input: 'text',
      inputPlaceholder: 'Type task details...',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      background: '#1e293b',
      color: '#fff',
      customClass: { popup: 'rounded-[2rem] border border-slate-700' }
    });
    if (desc) {
      await axios.post(`${API}/api/items`, { list_id: id, description: desc, status: 'pending' });
      fetchItems();
    }
  };

  const toggleStatus = async (itemId, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    await axios.put(`${API}/api/items/${itemId}`, { status: newStatus });
    fetchItems();
  };

  const handleEdit = async (itemId, currentDesc) => {
    const { value: newDesc } = await Swal.fire({
      title: 'Update Task',
      input: 'text',
      inputValue: currentDesc,
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      background: '#1e293b',
      color: '#fff',
      customClass: { popup: 'rounded-[2rem] border border-slate-700' }
    });
    if (newDesc && newDesc !== currentDesc) {
      await axios.put(`${API}/api/items/${itemId}`, { description: newDesc });
      fetchItems();
    }
  };

  const handleDelete = async (itemId) => {
    const result = await Swal.fire({
      title: 'Delete Task?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      background: '#1e293b',
      color: '#fff',
      customClass: { popup: 'rounded-[2rem] border border-slate-700' }
    });
    if (result.isConfirmed) {
      await axios.delete(`${API}/api/items/${itemId}`);
      fetchItems();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0f172a] text-slate-200 font-sans">
      <Header />
      
      <main className="flex-grow p-6 pb-24">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => navigate('/list')} className="group mb-12 flex items-center gap-2 text-slate-500 hover:text-indigo-400 font-bold transition-all text-xs uppercase tracking-widest">
            ← Workspace
          </button>

          <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-800 pb-8">
            <div className="space-y-1">
              <h1 className="text-5xl font-black text-white tracking-tighter">{state?.title || 'Active Plan'}</h1>
              <p className="text-indigo-400/80 font-bold text-sm uppercase">{items.filter(i => i.status !== 'completed').length} Tasks Pending</p>
            </div>
            <button onClick={handleAdd} className="bg-slate-800 border border-slate-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-600 transition-all text-xs uppercase tracking-tighter shadow-lg shadow-black/20">
              Add Objective
            </button>
          </header>

          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-20 text-slate-600 italic">Accessing data...</div>
            ) : items.length === 0 ? (
              <div className="text-center py-20 bg-slate-800/10 rounded-[2rem] border border-slate-800">
                <p className="text-slate-500 italic">No objectives assigned yet.</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className={`p-5 rounded-2xl border flex items-center justify-between group transition-all duration-300 ${item.status === 'completed' ? 'bg-slate-900/50 border-transparent opacity-40' : 'bg-slate-800/40 border-slate-700/50 hover:border-indigo-500/30'}`}>
                  <div className="flex items-center gap-4 flex-1">
                    <input 
                      type="checkbox" 
                      checked={item.status === 'completed'} 
                      onChange={() => toggleStatus(item.id, item.status)} 
                      className="w-5 h-5 rounded-md border-slate-600 bg-transparent text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
                    />
                    <span className={`text-lg font-medium transition-all ${item.status === 'completed' ? 'line-through text-slate-500' : 'text-slate-200'}`}>{item.description}</span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(item.id, item.description)} className="p-2 text-slate-500 hover:text-white transition-colors">✏️</button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-500 hover:text-red-400 transition-colors">🗑️</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Details;