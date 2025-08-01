import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [editData, setEditData] = useState(null);
  const API_URL = "http://localhost:8000/person";

  // Ambil data saat halaman pertama kali dibuka
  useEffect(() => {
    getAllData();
  }, []);

  // Ambil semua data dari API
  async function getAllData() {
    const response = await axios.get(API_URL);
    setUsers(response.data);
  }

  // Tangani perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Tambah data baru
  async function addData(e) {
    e.preventDefault(); //mencegah reload halaman.
    if (!formData.name || !formData.email) {
      return;
    }

    if (editData) {
      // Mode edit Data
      await axios.put(`${API_URL}/${editData}`, formData);
    } else {
      // Mode tambah Data
      await axios.post(API_URL, formData);
    }

    setFormData({ name: "", email: "" }); // reset form input
    setEditData(null); // reset form edit
    getAllData(); // refresh data
  }

    // Saat klik Edit
  const handleEdit = (user) => {
    setFormData({ name: user.name, email: user.email });
    setEditData(user.id);
  };

  return (
    <div className="wrapper">
      <div className="header">
        <h3>{editData ? "Edit Pengguna" : "Tambah Pengguna"}</h3>
        <form className="input-box" onSubmit={addData}>
          <input
            type="text"
            name="name"
            placeholder="Nama"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <button type="submit">{editData ? "Update" : "Simpan"}</button>
        </form>
      </div>

      <div className="data-pengguna">
        <h3>Data Pengguna</h3>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <div>
                {user.name} <span className="email">({user.email})</span>
              </div>
              <div>
                <a href="#" className="edit" onClick={() => handleEdit(user)}>
                  Edit
                </a>{" "}
                -{" "}
                <a href="#" className="delete">
                  Delete
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
