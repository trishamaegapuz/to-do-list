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
      Swal.fire('Server Error', 'Failed to load lists. Backend might be sleeping.', 'error');
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const addList = async () => {
    const { value } = await Swal.fire({
      title: 'Create New List',
      input: 'text',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
    });

    if (value) {
      await axios.post(`${API}/api/list`, { title: value });
      fetchLists();
    }
  };

  const editList = async (id, oldTitle, e) => {
    e.stopPropagation();
    const { value } = await Swal.fire({
      title: 'Rename List',
      input: 'text',
      inputValue: oldTitle,
      showCancelButton: true,
    });
    if (value) {
      await axios.put(`${API}/api/list/${id}`, { title: value });
      fetchLists();
    }
  };

  const deleteList = async (id, e) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: 'Delete this list?',
      icon: 'warning',
      showCancelButton: true,
    });
    if (result.isConfirmed) {
      await axios.delete(`${API}/api/list/${id}`);
      fetchLists();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 pb-24">
      <header className="max-w-2xl mx-auto mb-10 text-center">
        <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
          My Workspace
        </h1>
        <div className="h-1.5 w-24 bg-gradient-to-r from-indigo-500 to-violet-500 mx-auto mt-4 rounded-full"></div>
      </header>

      <div className="max-w-2xl mx-auto space-y-5">
        {lists.map((l, index) => (
          <div
            key={l.id}
            onClick={() => navigate(`/details/${l.id}`, { state: { title: l.title } })}
            className="bg-white p-6 rounded-[2rem] shadow-xl flex justify-between items-center cursor-pointer hover:scale-[1.02] transition"
          >
            <div>
              <span className="text-2xl font-bold">{l.title}</span>
            </div>

            <div className="flex gap-2">
              <button onClick={(e) => editList(l.id, l.title, e)}>✏️</button>
              <button onClick={(e) => deleteList(l.id, e)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6">
        <button
          onClick={addList}
          className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-5 rounded-[2rem]"
        >
          ✨ Create New List
        </button>
      </div>
    </div>
  );
}

export default List;
