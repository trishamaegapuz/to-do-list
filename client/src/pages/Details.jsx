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
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API}/api/items/${id}`);
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [id]);

  // --- 1. CREATE (ADD ITEM) ---
  const handleAdd = async () => {
    const { value: desc } = await Swal.fire({
      title: 'New Task',
      input: 'text',
      inputPlaceholder: 'Enter task description...',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
    });

    if (desc) {
      await axios.post(`${API}/api/items`, {
        list_id: id,
        description: desc,
        status: 'pending'
      });
      fetchItems();
    }
  };

  // --- 2. UPDATE (TOGGLE CHECKBOX) ---
  const toggleStatus = async (itemId, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    await axios.put(`${API}/api/items/${itemId}`, { status: newStatus });
    fetchItems();
  };

  // --- 3. UPDATE (EDIT DESCRIPTION) ---
  const handleEdit = async (itemId, currentDesc) => {
    const { value: newDesc } = await Swal.fire({
      title: 'Edit Task',
      input: 'text',
      inputValue: currentDesc,
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
    });

    if (newDesc && newDesc !== currentDesc) {
      await axios.put(`${API}/api/items/${itemId}`, { description: newDesc });
      fetchItems();
    }
  };

  // --- 4. DELETE (REMOVE ITEM) ---
  const handleDelete = async (itemId) => {
    const result = await Swal.fire({
      title: 'Delete this task?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
    });

    if (result.isConfirmed) {
      await axios.delete(`${API}/api/items/${itemId}`);
      fetchItems();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-24">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/list')}
          className="text-indigo-600 font-bold mb-8 flex items-center gap-2 hover:translate-x-[-4px] transition-transform"
        >
          ← Back to Workspace
        </button>

        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-slate-800">{state?.title || 'Tasks'}</h1>
            <p className="text-slate-500 mt-2">Manage your to-do items</p>
          </div>
          <button 
            onClick={handleAdd}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 shadow-lg transition-all"
          >
            + Add Task
          </button>
        </header>

        <div className="space-y-3">
          {loading ? (
            <p className="text-center text-slate-400">Loading tasks...</p>
          ) : items.length === 0 ? (
            <p className="text-center py-20 text-slate-400 italic">No tasks yet.</p>
          ) : (
            items.map((item) => (
              <div 
                key={item.id} 
                className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group"
              >
                <div className="flex items-center gap-4 flex-1">
                  <input 
                    type="checkbox" 
                    checked={item.status === 'completed'}
                    onChange={() => toggleStatus(item.id, item.status)}
                    className="w-6 h-6 accent-indigo-600 cursor-pointer" 
                  />
                  <span className={`text-lg ${item.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                    {item.description}
                  </span>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEdit(item.id, item.description)}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Details;