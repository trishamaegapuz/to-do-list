import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'https://to-do-list-8a22.onrender.com';

function Details() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(`${API}/api/items/${id}`);
        setItems(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchItems();
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* BACK TO LISTS BUTTON */}
        <button
          onClick={() => navigate('/list')}
          className="text-indigo-600 font-bold mb-8 flex items-center gap-2 hover:translate-x-[-4px] transition-transform"
        >
          ← Back to Workspace
        </button>

        <header className="mb-10">
          <h1 className="text-4xl font-black text-slate-800">{state?.title || 'List Items'}</h1>
          <p className="text-slate-500 mt-2">Manage your tasks below</p>
        </header>

        <div className="space-y-4">
          {items.length === 0 ? (
            <p className="text-slate-400 italic">No items yet...</p>
          ) : (
            items.map((item) => (
              <div 
                key={item.id} 
                className="bg-white p-5 rounded-2xl shadow-md border-l-4 border-indigo-500 flex items-center gap-4"
              >
                <input type="checkbox" className="w-5 h-5 accent-indigo-600" />
                <span className="text-lg text-slate-700">{item.description}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Details;