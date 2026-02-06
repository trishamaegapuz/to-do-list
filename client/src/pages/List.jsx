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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 p-6 pb-24">
      <header className="max-w-2xl mx-auto mb-10">
        {/* LOGOUT BUTTON */}
        <button 
          onClick={() => navigate('/')} 
          className="text-indigo-600 font-bold mb-6 flex items-center gap-2 hover:translate-x-[-4px] transition-transform"
        >
          ← Logout to Login
        </button>
        
        <div className="text-center">
          <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
            My Workspace
          </h1>
          <div className="h-1.5 w-24 bg-gradient-to-r from-indigo-500 to-violet-500 mx-auto mt-4 rounded-full"></div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto space-y-5">
        {loading ? (
          <p className="text-center text-slate-400">Loading lists...</p>
        ) : (
          lists.map((l) => (
            <div
              key={l.id}
              onClick={() => navigate(`/details/${l.id}`, { state: { title: l.title } })}
              className="bg-white p-6 rounded-[2rem] shadow-xl flex justify-between items-center cursor-pointer hover:scale-[1.02] transition-all border border-white/50"
            >
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-slate-800">{l.title}</span>
                <span className="text-sm text-slate-400">Tap to view items</span>
              </div>
              <div className="flex gap-4">
                <button className="text-xl hover:scale-125 transition">✏️</button>
                <button className="text-xl hover:scale-125 transition text-red-400">🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FLOATING ACTION BUTTON */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6">
        <button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-5 rounded-[2rem] shadow-2xl hover:shadow-indigo-300 transition-all text-lg">
          ✨ Create New List
        </button>
      </div>
    </div>
  );
}

export default List;