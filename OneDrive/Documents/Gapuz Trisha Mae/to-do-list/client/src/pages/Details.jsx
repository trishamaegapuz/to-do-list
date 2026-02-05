import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

function Details() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    const res = await axios.get(`${API}/api/items/${id}`);
    setItems(res.data);
  };

  useEffect(() => {
    fetchItems();
  }, [id]);

  const addItem = async () => {
    const { value } = await Swal.fire({
      title: 'Add New Item',
      input: 'text',
      showCancelButton: true,
    });

    if (value) {
      await axios.post(`${API}/api/items`, {
        list_id: id,
        description: value,
        status: 'pending'
      });
      fetchItems();
    }
  };

  const toggleStatus = async (item) => {
    await axios.put(`${API}/api/items/${item.id}`, {
      status: item.status === 'done' ? 'pending' : 'done'
    });
    fetchItems();
  };

  const editItem = async (item, e) => {
    e.stopPropagation();
    const { value } = await Swal.fire({
      title: 'Edit Item',
      input: 'text',
      inputValue: item.description,
      showCancelButton: true,
    });

    if (value) {
      await axios.patch(`${API}/api/items/${item.id}`, {
        description: value
      });
      fetchItems();
    }
  };

  const deleteItem = async (itemId, e) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: 'Delete item?',
      showCancelButton: true,
      icon: 'warning'
    });

    if (result.isConfirmed) {
      await axios.delete(`${API}/api/items/${itemId}`);
      fetchItems();
    }
  };

  return (
    <div className="min-h-screen p-6">
      <button onClick={() => navigate('/list')} className="mb-4 text-indigo-600">
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-6">{state?.title}</h1>

      {items.map(item => (
        <div key={item.id} className="bg-white p-4 mb-3 rounded shadow">
          <span onClick={() => toggleStatus(item)}>{item.description}</span>
          <div className="float-right space-x-2">
            <button onClick={(e) => editItem(item, e)}>Edit</button>
            <button onClick={(e) => deleteItem(item.id, e)}>Delete</button>
          </div>
        </div>
      ))}

      <button onClick={addItem} className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full">
        ➕
      </button>
    </div>
  );
}

export default Details;
