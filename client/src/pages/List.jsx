import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const API = 'https://to-do-list-8a22.onrender.com';
axios.defaults.withCredentials = true;

function List() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLists = async () => {
    try {
      const res = await axios.get(`${API}/api/list`);
      setLists(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLists(); }, []);

  const handleAdd = async () => {
    const { value: title } = await Swal.fire({
      title: 'New Workspace',
      input: 'text',
      inputPlaceholder: 'Enter title (e.g. Monday)',
      showCancelButton: true
    });
    if (title) {
      await axios.post(`${API}/api/list`, { title });
      fetchLists();
    }
  };

  const handleEdit = async (e, id, oldTitle) => {
    e.stopPropagation();
    const { value: newTitle } = await Swal.fire({
      title: 'Edit Title',
      input: 'text',
      inputValue: oldTitle,
      showCancelButton: true
    });
    if (newTitle && newTitle !== oldTitle) {
      await axios.put(`${API}/api/list/${id}`, { title: newTitle });
      fetchLists();
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This will delete all tasks inside!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33'
    });
    if (result.isConfirmed) {
      await axios.delete(`${API}/api/list/${id}`);
      fetchLists();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-24">
      <header className="max-w-2xl mx-auto mb-10 text-center">
        <button onClick={() => navigate('/')} className="text-indigo-600 font-bold mb-4 block">← Logout</button>
        <h1 className="text-5xl font-black text-slate-800">My Workspace</h1>
      </header>

      <div className="max-w-2xl mx-auto space-y-4">
        {loading ? <p className="text-center">Loading...</p> : lists.map((l) => (
          <div key={l.id} onClick={() => navigate(`/details/${l.id}`, { state: { title: l.title } })}
            className="bg-white p-6 rounded-[2rem] shadow-lg flex justify-between items-center cursor-pointer hover:scale-[1.01] transition-all border border-transparent hover:border-indigo-300">
            <div>
              <span className="text-2xl font-bold text-slate-800">{l.title}</span>
              <p className="text-sm text-slate-400">View tasks</p>
            </div>
            <div className="flex gap-2">
              <button onClick={(e) => handleEdit(e, l.id, l.title)} className="p-2 hover:bg-indigo-50 rounded-full">✏️</button>
              <button onClick={(e) => handleDelete(e, l.id)} className="p-2 hover:bg-red-50 rounded-full text-red-500">🗑️</button>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6">
        <button onClick={handleAdd} className="w-full bg-indigo-600 text-white font-bold py-5 rounded-[2rem] shadow-xl hover:bg-indigo-700 transition-all text-lg">
          ✨ Create New List
        </button>
      </div>
    </div>
  );
}

export default List;