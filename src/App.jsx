import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [errMessage, setErrMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [editData, setEditData] = useState(null);
  const API_URL = "http://localhost:8000/person";

  // Ambil data saat halaman pertama kali dibuka
  useEffect(() => {
    getAllData();
  }, []);

  // Ambil semua data dari API
  async function getAllData() {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
      setErrMessage("");
    } catch (err) {
      setErrMessage("GAGAL MENGAMBIL DATA ");
    }
  }

  //TAMBAH DATA BARU
  async function tambahData() {
    try {
      await axios.post(API_URL, formData);
      resetForm();
      getAllData();
    } catch (err) {
      console.error("Gagal menyimpan data:", err.message);
      alert("Terjadi kesalahan saat menyimpan data.");
    }
  }

  // EDIT/UPDATE DATA
  async function updateData() {
    try {
      await axios.put(`${API_URL}/${editData}`, formData);
      resetForm();
      getAllData();
    } catch (err) {
      console.error("Gagal menyimpan data:", err.message);
      alert("Terjadi kesalahan saat menyimpan data.");
    }
  }

  // DELETE DATA
  const handleDelete = async (id) => {
    const konfirmasi = window.confirm(
      "Apakah Anda yakin ingin menghapus data ini?"
    );
    if (!konfirmasi) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/${id}`);
      getAllData();
    } catch (err) {
      console.error("Gagal menghapus data:", err.message);
      alert("Terjadi kesalahan saat menghapus data.");
    }
  };

  // Tangani Prubahan Input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Saat Klik Edit
  const handleEdit = (user) => {
    setFormData({ name: user.name, email: user.email });
    setEditData(user.id);
  };

  //Reset Form
  const resetForm = () => {
    setFormData({ name: "", email: "" });
    setEditData(null);
  };
  
  // Submit Form Utama
  async function handleSubmit(e) {
    e.preventDefault(); //mencegah reload halaman.

    if (!formData.name || !formData.email) return;

    if (editData) {
      await updateData();
    } else {
      await tambahData();
    }
  }

  return (
    <div className="wrapper">
      <div className="header">
        <h3>{editData ? "Edit Pengguna" : "Tambah Pengguna"}</h3>
        <form className="input-box" onSubmit={handleSubmit}>
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
      {errMessage && (
        <div
          className="error-message"
          style={{ color: "red", marginBottom: "1rem" }}
        >
          {errMessage}
        </div>
      )}
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
                <a
                  href="#"
                  className="delete"
                  onClick={() => handleDelete(user.id)}
                >
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
