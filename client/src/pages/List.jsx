import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

<<<<<<< HEAD
const API = 'https://to-do-list-8a22.onrender.com';
axios.defaults.withCredentials = true;

=======
>>>>>>> d8111a500d3bd1ceaad0fd21c8004c1ecf3e5709
function List() {
  const [lists, setLists] = useState([]);
  const navigate = useNavigate();

  const fetchLists = async () => {
    try {
<<<<<<< HEAD
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
=======
      const res = await axios.get('http://localhost:3000/api/list');
      setLists(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchLists(); }, []);
>>>>>>> d8111a500d3bd1ceaad0fd21c8004c1ecf3e5709

  const addList = async () => {
    const { value } = await Swal.fire({
      title: 'Create New List',
      input: 'text',
<<<<<<< HEAD
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
    });

    if (value) {
      await axios.post(`${API}/api/list`, { title: value });
=======
      inputPlaceholder: 'e.g. Shopping, Work...',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
    });
    if (value) {
      await axios.post('http://localhost:3000/api/list', { title: value });
>>>>>>> d8111a500d3bd1ceaad0fd21c8004c1ecf3e5709
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
<<<<<<< HEAD
    });
    if (value) {
      await axios.put(`${API}/api/list/${id}`, { title: value });
=======
      confirmButtonColor: '#6366f1',
    });
    if (value) {
      await axios.put(`http://localhost:3000/api/list/${id}`, { title: value });
>>>>>>> d8111a500d3bd1ceaad0fd21c8004c1ecf3e5709
      fetchLists();
    }
  };

  const deleteList = async (id, e) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: 'Delete this list?',
<<<<<<< HEAD
      icon: 'warning',
      showCancelButton: true,
    });
    if (result.isConfirmed) {
      await axios.delete(`${API}/api/list/${id}`);
=======
      text: "All items inside will be removed.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
    });
    if (result.isConfirmed) {
      await axios.delete(`http://localhost:3000/api/list/${id}`);
>>>>>>> d8111a500d3bd1ceaad0fd21c8004c1ecf3e5709
      fetchLists();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 pb-24">
      <header className="max-w-2xl mx-auto mb-10 text-center">
<<<<<<< HEAD
        <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
=======
        <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 tracking-tight">
>>>>>>> d8111a500d3bd1ceaad0fd21c8004c1ecf3e5709
          My Workspace
        </h1>
        <div className="h-1.5 w-24 bg-gradient-to-r from-indigo-500 to-violet-500 mx-auto mt-4 rounded-full"></div>
      </header>

      <div className="max-w-2xl mx-auto space-y-5">
        {lists.map((l, index) => (
<<<<<<< HEAD
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
=======
          <div key={l.id}
            onClick={() => navigate(`/details/${l.id}`, { state: { title: l.title } })}
            className="group relative bg-white p-6 rounded-[2rem] shadow-xl shadow-indigo-100/50 border border-white flex justify-between items-center cursor-pointer hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex items-center gap-5">
              {/* Gradient Icon Circle */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg 
                ${index % 3 === 0 ? 'bg-gradient-to-tr from-blue-500 to-indigo-500' : 
                  index % 3 === 1 ? 'bg-gradient-to-tr from-violet-500 to-purple-500' : 
                  'bg-gradient-to-tr from-pink-500 to-rose-500'}`}>
                {l.title.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-800 block">{l.title}</span>
                <span className="text-slate-400 text-sm font-medium">Click to view items</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button onClick={(e) => editList(l.id, l.title, e)} className="p-3 bg-slate-50 hover:bg-indigo-50 rounded-2xl text-indigo-500 transition-colors">✏️</button>
              <button onClick={(e) => deleteList(l.id, e)} className="p-3 bg-slate-50 hover:bg-red-50 rounded-2xl text-red-400 transition-colors">🗑️</button>
>>>>>>> d8111a500d3bd1ceaad0fd21c8004c1ecf3e5709
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6">
<<<<<<< HEAD
        <button
          onClick={addList}
          className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-5 rounded-[2rem]"
        >
          ✨ Create New List
=======
        <button 
          onClick={addList} 
          className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-5 rounded-[2rem] shadow-2xl shadow-indigo-300 transition-all active:scale-95 flex items-center justify-center gap-3 text-lg"
        >
          <span className="text-2xl">✨</span> Create New List
>>>>>>> d8111a500d3bd1ceaad0fd21c8004c1ecf3e5709
        </button>
      </div>
    </div>
  );
}

<<<<<<< HEAD
export default List;
=======
export default List;
>>>>>>> d8111a500d3bd1ceaad0fd21c8004c1ecf3e5709
