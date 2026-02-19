import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Siguraduhin na tama ang URL ng iyong Render backend
const API = 'https://to-do-list-8a22.onrender.com';
axios.defaults.withCredentials = true;

function List() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. FETCH DATA - May kasamang auto-bounce sa login kung expired ang session
  const fetchLists = async () => {
    try {
      const res = await axios.get(`${API}/api/list`);
      setLists(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
      if (err.response?.status === 401) {
        navigate('/'); // Ibalik sa login kung walang valid cookie
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  // 2. LOGOUT FUNCTION
  const handleLogout = async () => {
    try {
      await axios.post(`${API}/logout`);
      window.location.href = '/'; // Hard refresh para malinis ang auth state
    } catch (err) {
      window.location.href = '/';
    }
  };

  // 3. ADD NEW LIST
  const handleAdd = async () => {
    const { value: title } = await Swal.fire({
      title: 'New Workspace',
      input: 'text',
      inputPlaceholder: 'Anong gagawin mo ngayon?',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      background: '#1e293b',
      color: '#fff'
    });

    if (title) {
      try {
        await axios.post(`${API}/api/list`, { title });
        fetchLists(); // I-refresh ang listahan
      } catch (err) {
        if (err.response?.status === 401) navigate('/');
      }
    }
  };

  // 4. EDIT LIST TITLE
  const handleEdit = async (e, id, oldTitle) => {
    e.stopPropagation(); // Pigilan ang pagbukas ng details page
    const { value: newTitle } = await Swal.fire({
      title: 'Edit Title',
      input: 'text',
      inputValue: oldTitle,
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      background: '#1e293b',
      color: '#fff'
    });

    if (newTitle && newTitle !== oldTitle) {
      try {
        await axios.put(`${API}/api/list/${id}`, { title: newTitle });
        fetchLists();
      } catch (err) {
        if (err.response?.status === 401) navigate('/');
      }
    }
  };

  // 5. DELETE LIST
  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Pigilan ang pagbukas ng details page
    const result = await Swal.fire({
      title: 'Sigurado ka ba?',
      text: "Mabubura pati ang mga items sa loob nito!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#334155',
      confirmButtonText: 'Yes, Delete it!',
      background: '#1e293b',
      color: '#fff'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API}/api/list/${id}`);
        fetchLists();
      } catch (err) {
        if (err.response?.status === 401) navigate('/');
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0f172a] text-slate-200">
      <Header />
      
      <main className="flex-grow p-6 pb-32">
        <div className="max-w-2xl mx-auto mb-8 flex justify-between items-center">
          <button 
            onClick={handleLogout} 
            className="px-4 py-2 bg-slate-800/40 border border-slate-700 rounded-xl text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-all"
          >
            ← Logout Session
          </button>
          <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full uppercase tracking-widest">
            Cloud Sync Active
          </span>
        </div>

        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl font-black text-white text-center mb-10 tracking-tight">My Workspace</h2>
          
          {loading ? (
            <div className="text-center py-20 text-indigo-400 animate-pulse font-bold tracking-widest">
              FETCHING DATA...
            </div>
          ) : lists.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-slate-800 rounded-3xl text-slate-600">
              Walang laman ang iyong listahan.
            </div>
          ) : (
            lists.map((l) => (
              <div 
                key={l.id} 
                onClick={() => navigate(`/details/${l.id}`, { state: { title: l.title } })}
                className="bg-slate-800/30 p-6 rounded-[2rem] border border-slate-800 flex justify-between items-center cursor-pointer hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all group"
              >
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">{l.title}</h3>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">
                    Click to view tasks
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => handleEdit(e, l.id, l.title)} 
                    className="p-3 bg-slate-800 rounded-xl border border-slate-700 hover:bg-slate-700 transition-colors"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={(e) => handleDelete(e, l.id)} 
                    className="p-3 bg-slate-800 rounded-xl border border-slate-700 hover:bg-red-900/30 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* FLOATING ACTION BUTTON */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xs px-6">
        <button 
          onClick={handleAdd} 
          className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:bg-indigo-500 active:scale-95 transition-all text-xs uppercase tracking-widest"
        >
          + Create New List
        </button>
      </div>

      <Footer />
    </div>
  );
}

export default List;