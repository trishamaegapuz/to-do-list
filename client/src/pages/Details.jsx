import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API = 'https://to-do-list-8a22.onrender.com';
axios.defaults.withCredentials = true;

function Details() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API}/api/items/${id}`);
      setItems(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchItems(); }, [id]);

  const handleAdd = async () => {
    const { value: desc } = await Swal.fire({
      title: 'New Task',
      input: 'text',
      showCancelButton: true
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

  const handleDelete = async (itemId) => {
    const result = await Swal.fire({ title: 'Delete task?', showCancelButton: true });
    if (result.isConfirmed) {
      await axios.delete(`${API}/api/items/${itemId}`);
      fetchItems();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-24">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate('/list')} className="text-indigo-600 font-bold mb-8 block">← Back</button>
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-black text-slate-800">{state?.title || 'Tasks'}</h1>
          <button onClick={handleAdd} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold">+ Add</button>
        </header>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <input type="checkbox" checked={item.status === 'completed'} onChange={() => toggleStatus(item.id, item.status)} className="w-5 h-5 accent-indigo-600" />
                <span className={`text-lg ${item.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-700'}`}>{item.description}</span>
              </div>
              <button onClick={() => handleDelete(item.id)} className="text-red-300 hover:text-red-500">🗑️</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Details;