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
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLists(); }, []);

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
      <Header />
      
      <main className="flex-grow p-6 pb-32">
        <header className="max-w-2xl mx-auto mb-12 mt-8 text-center">
          <button 
            onClick={() => navigate('/')} 
            className="mb-8 px-4 py-2 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 rounded-full text-slate-400 text-xs transition-all mx-auto block"
          >
            ← Logout Session
          </button>
          
          <h1 className="text-5xl font-black tracking-tight text-white mb-2">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Workspace</span>
          </h1>
          <p className="text-slate-500 font-medium italic">Streamline your workflow with precision</p>
        </header>

        <div className="max-w-2xl mx-auto grid gap-4">
          {loading ? (
            <div className="flex justify-center py-20 text-indigo-400 font-bold animate-pulse">Syncing environment...</div>
          ) : lists.length === 0 ? (
            <div className="text-center py-20 bg-slate-800/20 rounded-[3rem] border border-dashed border-slate-700">
              <p className="text-slate-500 text-lg">No active workspaces found.</p>
            </div>
          ) : (
            lists.map((l) => (
              <div 
                key={l.id} 
                onClick={() => navigate(`/details/${l.id}`, { state: { title: l.title } })}
                className="group bg-slate-800/40 backdrop-blur-sm p-6 rounded-[2rem] border border-slate-700/50 hover:border-indigo-500/50 hover:bg-slate-800/60 flex justify-between items-center cursor-pointer transition-all duration-300"
              >
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{l.title}</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-1">Open Repository</span>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => handleEdit(e, l.id, l.title)} className="p-2 hover:text-indigo-400 transition-colors">✏️</button>
                  <button onClick={(e) => handleDelete(e, l.id)} className="p-2 hover:text-red-400 transition-colors">🗑️</button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xs px-6 z-40">
        <button onClick={handleAdd} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-900/20 hover:bg-indigo-500 hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2">
          <span className="text-xl">+</span> Create New List
        </button>
      </div>

      <Footer />
    </div>
  );
}

export default List;