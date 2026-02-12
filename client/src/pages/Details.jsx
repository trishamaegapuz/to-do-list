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
      title: 'Add New Task',
      input: 'text',
      inputPlaceholder: 'Enter task description...',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      customClass: { popup: 'rounded-[2rem]' }
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
      customClass: { popup: 'rounded-[2rem]' }
    });
    if (newDesc && newDesc !== currentDesc) {
      await axios.put(`${API}/api/items/${itemId}`, { description: newDesc });
      fetchItems();
    }
  };

  const handleDelete = async (itemId) => {
    const result = await Swal.fire({
      title: 'Delete this task?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      customClass: { popup: 'rounded-[2rem]' }
    });
    if (result.isConfirmed) {
      await axios.delete(`${API}/api/items/${itemId}`);
      fetchItems();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans">
      <Header />
      
      <main className="flex-grow p-6 pb-24">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => navigate('/list')} className="group mb-12 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold transition-all">
            <span className="bg-white p-2 rounded-xl shadow-sm text-xs">← Back</span>
          </button>

          <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1">
              <h1 className="text-5xl font-black text-slate-900 tracking-tight">{state?.title || 'Daily Plan'}</h1>
              <p className="text-slate-400 font-medium">You have {items.filter(i => i.status !== 'completed').length} tasks remaining</p>
            </div>
            <button onClick={handleAdd} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-900 shadow-lg transition-all active:scale-95 text-sm">+ New Task</button>
          </header>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-20 text-slate-300 font-bold animate-pulse italic">Syncing tasks...</div>
            ) : items.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                <span className="text-4xl block mb-4 italic text-slate-200 font-black">EMPTY</span>
                <p className="text-slate-400 italic">Plan your first task for today.</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className={`bg-white p-6 rounded-[2rem] shadow-sm border flex items-center justify-between group transition-all duration-300 ${item.status === 'completed' ? 'border-transparent opacity-60 bg-slate-50/50' : 'border-slate-100 hover:border-indigo-200'}`}>
                  <div className="flex items-center gap-5 flex-1">
                    <div className="relative flex items-center justify-center">
                      <input type="checkbox" checked={item.status === 'completed'} onChange={() => toggleStatus(item.id, item.status)} className="peer appearance-none w-8 h-8 rounded-xl border-2 border-indigo-100 checked:bg-indigo-600 checked:border-indigo-600 transition-all cursor-pointer" />
                      <span className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none text-xs">✓</span>
                    </div>
                    <span className={`text-xl font-bold transition-all duration-500 ${item.status === 'completed' ? 'line-through text-slate-400 decoration-2' : 'text-slate-700'}`}>{item.description}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(item.id, item.description)} className="p-3 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all">✏️</button>
                    <button onClick={() => handleDelete(item.id)} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">🗑️</button>
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