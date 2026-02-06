<<<<<<< HEAD
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
=======
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function Details() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    const res = await axios.get(`http://localhost:3000/api/items/${id}`);
    setItems(res.data);
  };

  useEffect(() => {
    fetchItems();
  }, [id]);

  // ADD ITEM
  const addItem = async () => {
    const { value } = await Swal.fire({
      title: 'Add New Item',
      input: 'text',
      inputPlaceholder: 'e.g. Buy clothes',
>>>>>>> d8111a500d3bd1ceaad0fd21c8004c1ecf3e5709
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
    });

    if (value) {
<<<<<<< HEAD
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
=======
      await axios.post('http://localhost:3000/api/items', {
        list_id: id,
        description: value,
        status: 'pending'
      });
      fetchItems();
    }
  };

  // TOGGLE STATUS
  const toggleStatus = async (item) => {
    await axios.put(`http://localhost:3000/api/items/${item.id}`, {
      status: item.status === 'done' ? 'pending' : 'done'
    });
    fetchItems();
  };

  // EDIT ITEM
  const editItem = async (item, e) => {
    e.stopPropagation();
    const { value } = await Swal.fire({
      title: 'Edit Item',
      input: 'text',
      inputValue: item.description,
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
    });

    if (value) {
      await axios.patch(`http://localhost:3000/api/items/${item.id}`, {
        description: value
      });
      fetchItems();
    }
  };

  // DELETE ITEM
  const deleteItem = async (itemId, e) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: 'Delete this item?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
    });

    if (result.isConfirmed) {
      await axios.delete(`http://localhost:3000/api/items/${itemId}`);
      fetchItems();
>>>>>>> d8111a500d3bd1ceaad0fd21c8004c1ecf3e5709
    }
  };

  return (
<<<<<<< HEAD
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
=======
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-violet-100 p-6 pb-28">
      
      {/* HEADER */}
      <div className="max-w-2xl mx-auto mb-8">
        <button
          onClick={() => navigate('/list')}
          className="text-indigo-600 font-semibold mb-4 hover:underline"
        >
          ← Back to Lists
        </button>

        <h1 className="text-4xl font-black text-slate-800">
          {state?.title || 'My List'}
        </h1>
        <p className="text-slate-500 mt-1">Checklist items</p>
      </div>

      {/* ITEMS */}
      <div className="max-w-2xl mx-auto space-y-4">
        {items.length === 0 && (
          <p className="text-center text-slate-400">
            No items yet. Click “Add Item” 👇
          </p>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleStatus(item)}
            className={`group bg-white p-5 rounded-2xl shadow-lg flex items-center justify-between cursor-pointer transition-all
              ${item.status === 'done'
                ? 'opacity-70 border-l-8 border-green-500'
                : 'border-l-8 border-indigo-500'}
            `}
          >
            <div className="flex items-center gap-4">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                ${item.status === 'done'
                  ? 'bg-green-500 border-green-500'
                  : 'border-indigo-400'}
              `}>
                {item.status === 'done' && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>

              <span className={`text-lg font-medium
                ${item.status === 'done'
                  ? 'line-through text-slate-400'
                  : 'text-slate-700'}
              `}>
                {item.description}
              </span>
            </div>

            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={(e) => editItem(item, e)}
                className="px-3 py-1 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
              >
                Edit
              </button>
              <button
                onClick={(e) => deleteItem(item.id, e)}
                className="px-3 py-1 rounded-xl bg-red-50 text-red-500 hover:bg-red-100"
              >
                Delete
              </button>
>>>>>>> d8111a500d3bd1ceaad0fd21c8004c1ecf3e5709
            </div>
          </div>
        ))}
      </div>

<<<<<<< HEAD
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6">
        <button
          onClick={addList}
          className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-5 rounded-[2rem]"
        >
          ✨ Create New List
=======
      {/* ADD BUTTON */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6">
        <button
          onClick={addItem}
          className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-5 rounded-[2rem] shadow-2xl transition-all active:scale-95 text-lg"
        >
          ➕ Add New Item
>>>>>>> d8111a500d3bd1ceaad0fd21c8004c1ecf3e5709
        </button>
      </div>
    </div>
  );
}

<<<<<<< HEAD
export default List;
=======
export default Details;
>>>>>>> d8111a500d3bd1ceaad0fd21c8004c1ecf3e5709
