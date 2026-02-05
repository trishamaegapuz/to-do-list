import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = 'https://to-do-list-rho-sable-68.vercel.app';

function Details() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/items/${id}`);
      setItems(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchItems(); }, [id]);

  const addItem = async () => {
    const { value } = await Swal.fire({
      title: 'Add New Item',
      input: 'text',
      inputPlaceholder: 'e.g. Buy clothes',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
    });

    if (value) {
      await axios.post(`${API_URL}/api/items`, {
        list_id: id,
        description: value,
        status: 'pending'
      });
      fetchItems();
    }
  };

  const toggleStatus = async (item) => {
    await axios.put(`${API_URL}/api/items/${item.id}`, {
      status: item.status === 'done' ? 'pending' : 'done'
    });
    fetchItems();
  };

  const editItem = async (item, e) => {
    e.stopPropagation();
    const { value } = await Swal.fire({
      title: 'Edit Item',
      input: 'text',
      inputValue: item.description,
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
    });

    if (value) {
      await axios.patch(`${API_URL}/api/items/${item.id}`, {
        description: value
      });
      fetchItems();
    }
  };

  const deleteItem = async (itemId, e) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: 'Delete this item?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
    });

    if (result.isConfirmed) {
      await axios.delete(`${API_URL}/api/items/${itemId}`);
      fetchItems();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-violet-100 p-6 pb-28">
      <div className="max-w-2xl mx-auto mb-8">
        <button onClick={() => navigate('/list')} className="text-indigo-600 font-semibold mb-4 hover:underline">← Back to Lists</button>
        <h1 className="text-4xl font-black text-slate-800">{state?.title || 'My List'}</h1>
        <p className="text-slate-500 mt-1">Checklist items</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {items.map((item) => (
          <div key={item.id} onClick={() => toggleStatus(item)}
            className={`group bg-white p-5 rounded-2xl shadow-lg flex items-center justify-between cursor-pointer transition-all
              ${item.status === 'done' ? 'opacity-70 border-l-8 border-green-500' : 'border-l-8 border-indigo-500'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${item.status === 'done' ? 'bg-green-500 border-green-500' : 'border-indigo-400'}`}>
                {item.status === 'done' && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
              <span className={`text-lg font-medium ${item.status === 'done' ? 'line-through text-slate-400' : 'text-slate-700'}`}>{item.description}</span>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
              <button onClick={(e) => editItem(item, e)} className="px-3 py-1 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100">Edit</button>
              <button onClick={(e) => deleteItem(item.id, e)} className="px-3 py-1 rounded-xl bg-red-50 text-red-500 hover:bg-red-100">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6">
        <button onClick={addItem} className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-5 rounded-[2rem] shadow-2xl transition-all active:scale-95 text-lg">➕ Add New Item</button>
      </div>
    </div>
  );
}

export default Details;