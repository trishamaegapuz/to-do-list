import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

// Siguraduhing ito ang URL ng iyong Render Backend
const API = 'https://to-do-list-8a22.onrender.com';
axios.defaults.withCredentials = true;

function Details() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  // 1. FETCH ALL ITEMS FOR THIS LIST
  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API}/api/items/${id}`);
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [id]);

  // 2. ADD NEW ITEM
  const addItem = async () => {
    const { value } = await Swal.fire({
      title: 'Add New Item',
      input: 'text',
      inputPlaceholder: 'e.g. Buy clothes',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
    });

    if (value) {
      try {
        await axios.post(`${API}/api/items`, {
          list_id: id,
          description: value,
          status: 'pending'
        });
        fetchItems();
      } catch (err) {
        Swal.fire('Error', 'Could not add item', 'error');
      }
    }
  };

  // 3. TOGGLE ITEM STATUS (Done / Pending)
  const toggleStatus = async (item) => {
    try {
      await axios.put(`${API}/api/items/${item.id}`, {
        status: item.status === 'done' ? 'pending' : 'done'
      });
      fetchItems();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // 4. EDIT ITEM DESCRIPTION
  const editItem = async (item, e) => {
    e.stopPropagation(); // Iwas trigger sa toggleStatus
    const { value } = await Swal.fire({
      title: 'Edit Item',
      input: 'text',
      inputValue: item.description,
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
    });

    if (value) {
      try {
        await axios.patch(`${API}/api/items/${item.id}`, {
          description: value
        });
        fetchItems();
      } catch (err) {
        Swal.fire('Error', 'Could not edit item', 'error');
      }
    }
  };

  // 5. DELETE ITEM
  const deleteItem = async (itemId, e) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: 'Delete this item?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API}/api/items/${itemId}`);
        fetchItems();
      } catch (err) {
        Swal.fire('Error', 'Could not delete item', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-violet-100 p-6 pb-28">
      
      {/* HEADER */}
      <div className="max-w-2xl mx-auto mb-8">
        <button
          onClick={() => navigate('/list')}
          className="text-indigo-600 font-semibold mb-4 hover:underline flex items-center gap-2"
        >
          ← Back to Lists
        </button>

        <h1 className="text-4xl font-black text-slate-800">
          {state?.title || 'My List'}
        </h1>
        <p className="text-slate-500 mt-1">Checklist items</p>
      </div>

      {/* ITEMS LIST */}
      <div className="max-w-2xl mx-auto space-y-4">
        {items.length === 0 ? (
          <p className="text-center text-slate-400 py-10">
            No items yet. Click “Add Item” 👇
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleStatus(item)}
              className={`group bg-white p-5 rounded-2xl shadow-lg flex items-center justify-between cursor-pointer transition-all border-l-8
                ${item.status === 'done'
                  ? 'opacity-70 border-green-500'
                  : 'border-indigo-500'}
              `}
            >
              <div className="flex items-center gap-4">
                {/* Checkbox Visual */}
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                  ${item.status === 'done'
                    ? 'bg-green-500 border-green-500'
                    : 'border-indigo-400'}
                `}>
                  {item.status === 'done' && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>

                <span className={`text-lg font-medium transition-all
                  ${item.status === 'done'
                    ? 'line-through text-slate-400'
                    : 'text-slate-700'}
                `}>
                  {item.description}
                </span>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => editItem(item, e)}
                  className="px-3 py-1 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => deleteItem(item.id, e)}
                  className="px-3 py-1 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FLOATING ADD BUTTON */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6">
        <button
          onClick={addItem}
          className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-5 rounded-[2rem] shadow-2xl shadow-indigo-200 transition-all active:scale-95 text-lg flex items-center justify-center gap-2"
        >
          <span>➕</span> Add New Item
        </button>
      </div>
    </div>
  );
}

export default Details;