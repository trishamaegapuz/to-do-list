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
    } catch (err) {
      if (err.response?.status === 401) navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, [id]);

  const handleAdd = async () => {
    const { value: desc } = await Swal.fire({ title: 'New Task', input: 'text', showCancelButton: true });
    if (desc) {
      await axios.post(`${API}/api/items`, { list_id: id, description: desc });
      fetchItems();
    }
  };

  const toggleStatus = async (itemId, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    await axios.put(`${API}/api/items/${itemId}`, { status: newStatus });
    fetchItems();
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Header />
      <main className="p-6 max-w-2xl mx-auto">
        <button onClick={() => navigate('/list')} className="mb-6 text-xs text-slate-500 font-bold">← BACK</button>
        <div className="flex justify-between items-center mb-10 border-b border-slate-800 pb-6">
          <h1 className="text-4xl font-black">{state?.title || 'Tasks'}</h1>
          <button onClick={handleAdd} className="bg-indigo-600 px-4 py-2 rounded-xl text-xs font-bold">ADD TASK</button>
        </div>
        
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="p-4 bg-slate-800/40 rounded-2xl flex items-center justify-between border border-slate-800">
               <div className="flex items-center gap-4">
                  <input type="checkbox" checked={item.status === 'completed'} onChange={() => toggleStatus(item.id, item.status)} className="w-5 h-5" />
                  <span className={item.status === 'completed' ? 'line-through text-slate-500' : ''}>{item.description}</span>
               </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
export default Details;