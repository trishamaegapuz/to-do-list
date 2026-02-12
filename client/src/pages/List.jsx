import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Header from '../components/Header'; // Siguraduhing tama ang path
import Footer from '../components/Footer';

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
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      customClass: { popup: 'rounded-[2rem]' }
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
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      customClass: { popup: 'rounded-[2rem]' }
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
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6366f1',
      customClass: { popup: 'rounded-[2rem]' }
    });
    if (result.isConfirmed) {
      await axios.delete(`${API}/api/list/${id}`);
      fetchLists();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans">
      <Header />
      
      <main className="flex-grow p-6 pb-32">
        <header className="max-w-2xl mx-auto mb-12 mt-8">
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={() => navigate('/')} 
              className="group flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold transition-all"
            >
              <span className="bg-white p-2 rounded-xl shadow-sm group-hover:shadow-md transition-all text-xs">← Logout</span>
            </button>
          </div>
          
          <div className="text-center space-y-2">
            <h1 className="text-6xl font-black tracking-tight text-slate-900 italic">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Workspace</span>
            </h1>
            <p className="text-slate-400 font-medium">Organize your daily goals beautifully</p>
          </div>
        </header>

        <div className="max-w-2xl mx-auto grid gap-5">
          {loading ? (
            <div className="flex justify-center py-20 animate-pulse text-slate-300 font-bold">Loading Workspace...</div>
          ) : lists.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
              <p className="text-slate-400 text-lg italic">Your workspace is empty.</p>
            </div>
          ) : (
            lists.map((l) => (
              <div 
                key={l.id} 
                onClick={() => navigate(`/details/${l.id}`, { state: { title: l.title } })}
                className="group bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-100 flex justify-between items-center cursor-pointer transition-all duration-500 border border-slate-100 hover:border-indigo-200 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600 opacity-0 group-hover:opacity-100 transition-all"></div>
                <div className="flex flex-col gap-1">
                  <span className="text-2xl font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors">{l.title}</span>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">View Details</p>
                </div>

                <div className="flex gap-3 translate-x-4 group-hover:translate-x-0 transition-all">
                  <button onClick={(e) => handleEdit(e, l.id, l.title)} className="bg-slate-50 p-3 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">✏️</button>
                  <button onClick={(e) => handleDelete(e, l.id)} className="bg-slate-50 p-3 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm">🗑️</button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Floating Add Button */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-lg px-6 z-40">
        <button onClick={handleAdd} className="w-full bg-slate-900 text-white font-bold py-6 rounded-[2.5rem] shadow-2xl hover:bg-indigo-600 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 text-xl group">
          <span className="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform">✨</span>
          Create New List
        </button>
      </div>

      <Footer />
    </div>
  );
}

export default List;