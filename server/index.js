import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const API = 'https://to-do-list-8a22.onrender.com';
axios.defaults.withCredentials = true;

function List() {
  const [lists, setLists] = useState([]);
  const navigate = useNavigate();

  const fetchLists = async () => {
    try {
      const res = await axios.get(`${API}/api/list`);
      setLists(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchLists(); }, []);

  const addList = async () => {
    const { value } = await Swal.fire({
      title: 'New List Title',
      input: 'text',
      showCancelButton: true,
    });
    if (value) {
      await axios.post(`${API}/api/list`, { title: value });
      fetchLists();
    }
  };

  const deleteList = async (id, e) => {
    e.stopPropagation();
    const res = await Swal.fire({ title: 'Delete?', showCancelButton: true, icon: 'warning' });
    if (res.isConfirmed) {
      await axios.delete(`${API}/api/list/${id}`);
      fetchLists();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <header className="max-w-2xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-black text-indigo-600">My Workspace</h1>
      </header>

      <div className="max-w-2xl mx-auto space-y-4">
        {lists.map((l) => (
          <div 
            key={l.id} 
            onClick={() => navigate(`/details/${l.id}`, { state: { title: l.title } })}
            className="bg-white p-5 rounded-2xl shadow-md flex justify-between items-center cursor-pointer hover:shadow-lg transition"
          >
            <span className="text-xl font-bold text-slate-700">{l.title}</span>
            <button onClick={(e) => deleteList(l.id, e)} className="text-red-400">🗑️</button>
          </div>
        ))}
      </div>

      <button onClick={addList} className="fixed bottom-8 right-8 bg-indigo-600 text-white p-4 rounded-full shadow-xl">
        + Add List
      </button>
    </div>
  );
}

export default List;