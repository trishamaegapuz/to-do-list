import { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'https://to-do-list-8a22.onrender.com';
axios.defaults.withCredentials = true;

function List() {
  const [lists, setLists] = useState([]);

  // 1. GET ALL LISTS
  const fetchLists = async () => {
    try {
      const res = await axios.get(`${API}/api/list`); // May /api/
      setLists(res.data);
    } catch (err) {
      console.error("Error fetching lists", err);
    }
  };

  useEffect(() => { fetchLists(); }, []);

  // 2. ADD NEW LIST
  const addList = async (title) => {
    await axios.post(`${API}/api/list`, { title }); // May /api/
    fetchLists();
  };

  // 3. DELETE LIST
  const deleteList = async (id) => {
    await axios.delete(`${API}/api/list/${id}`); // May /api/
    fetchLists();
  };

  return (
    <div>
      {/* Iyong UI logic para sa pag-display ng lists */}
    </div>
  );
}

export default List;