import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Header from '../components/Header';
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
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    fetchLists(); 
  }, []);

  const handleAdd = async () => {
    const { value: title } = await Swal.fire({
      title: 'New Workspace',
      input: 'text',
      inputPlaceholder: 'Enter title (e.g. Projects)',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      background: '#1e293b',
      color: '#fff',
      customClass: { popup: 'rounded-[2rem] border border-slate-700' }
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
      background: '#1e293b',
      color: '#fff',
      customClass: { popup: 'rounded-[2rem] border border-slate-700' }
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
      background: '#1e293b',
      color: '#fff',
      customClass: { popup: 'rounded-[2rem] border border-slate-700' }
    });
    if (result.isConfirmed) {
      await axios.delete(`${API}/api/list/${id}`);
      fetchLists();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Header component has logo on the right based on our update */}
      <Header />
      
      <main className="flex-grow p-6 pb-32">
        <header className="max-w-2xl mx-auto mb-12 mt-4">
          
          {/* Logout Button positioned to the Left */}
          <div className="flex justify-start mb-10">
            <button 
              onClick={() => navigate('/')} 
              className="px-4 py-2 bg-slate-800/40 hover:bg-red-500/10 hover:text-red-400 border border-slate-700 rounded-xl text-slate-500 text-[10px] font-bold uppercase tracking-widest transition-all"
            >
              ← Logout Session
            </button>
          </div>
          
          <div className="text-center space-y-2">
            <h1 className="text-5xl font-black tracking-tighter text-white">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Workspace</span>
            </h1>
            <p className="text-slate-500 font-medium italic text-sm">Organize your daily workflow with precision</p>
          </div>
        </header>

        <div className="max-w-2xl mx-auto grid gap-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
               <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
               <p className="text-indigo-400 text-xs font-bold uppercase tracking-[0.3em]">Syncing Environment</p>
            </div>
          ) : lists.length === 0 ? (
            <div className="text-center py-20 bg-slate-800/10 rounded-[3rem] border border-dashed border-slate-800">
              <p className="text-slate-600 text-sm font-medium italic">Workspace is currently empty.</p>
            </div>
          ) : (
            lists.map((l) => (
              <div 
                key={l.id} 
                onClick={() => navigate(`/details/${l.id}`, { state: { title: l.title } })}
                className="group bg-slate-800/30 backdrop-blur-sm p-7 rounded-[2rem] border border-slate-800/50 hover:border-indigo-500/40 hover:bg-slate-800/50 flex justify-between items-center cursor-pointer transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors tracking-tight">
                    {l.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-bold">Active Repository</span>
                  </div>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                  <button 
                    onClick={(e) => handleEdit(e, l.id, l.title)} 
                    className="p-3 bg-slate-800/50 rounded-xl hover:bg-indigo-600 hover:text-white transition-all border border-slate-700"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={(e) => handleDelete(e, l.id)} 
                    className="p-3 bg-slate-800/50 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-slate-700"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xs px-6 z-40">
        <button 
          onClick={handleAdd} 
          className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-2xl shadow-indigo-900/40 hover:bg-indigo-500 hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 text-xs uppercase tracking-widest"
        >
          <span className="text-lg">+</span> Create New List
        </button>
      </div>

      <Footer />
    </div>
  );
}

export default List;