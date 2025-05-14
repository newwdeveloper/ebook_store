import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminPage = () => {
  const [ebooks, setEbooks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
    fileUrl: "",
  });
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token"); // Assume token is stored after login

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    window.location.href = "/login"; // Redirect to login page
  };

  // Fetch ebooks
  const fetchEbooks = async () => {
    try {
      const res = await axios.get(
        "https://ebook-store-backend.onrender.com/api/ebooks"
      );
      setEbooks(res.data);
    } catch (err) {
      toast.error("Failed to fetch ebooks");
    }
  };

  useEffect(() => {
    fetchEbooks();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  // Handle submit for adding or updating ebooks
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const confirmEdit = window.confirm(
          "Are you sure you want to save these changes?"
        );
        if (!confirmEdit) {
          toast.info("Update cancelled");
          return;
        }

        await axios.put(
          `https://ebook-store-backend.onrender.com/api/ebooks/${editingId}`,
          form,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Ebook updated!");
        setEditingId(null);
      } else {
        await axios.post(
          "https://ebook-store-backend.onrender.com/api/ebooks",
          form,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Ebook added!");
      }

      setForm({
        title: "",
        description: "",
        price: "",
        imageUrl: "",
        fileUrl: "",
      });
      fetchEbooks();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  // Handle ebook delete
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this ebook?"
    );
    if (!confirmDelete) {
      toast.info("Delete cancelled");
      return;
    }

    try {
      await axios.delete(
        `https://ebook-store-backend.onrender.com/api/ebooks/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Ebook deleted!");
      fetchEbooks();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // Handle edit button click
  const handleEdit = (ebook) => {
    setForm({
      title: ebook.title,
      description: ebook.description,
      price: ebook.price,
      imageUrl: ebook.imageUrl,
      fileUrl: ebook.fileUrl,
    });
    setEditingId(ebook._id); // Set the ebook id for editing
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">File URL</label>
          <input
            type="text"
            name="fileUrl"
            value={form.fileUrl}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editingId ? "Update Ebook" : "Add Ebook"}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-2xl font-bold">Ebook List</h2>
        <div className="space-y-4">
          {ebooks.map((ebook) => (
            <div
              key={ebook._id}
              className="flex justify-between items-center bg-white shadow-md rounded p-4"
            >
              <div>
                <h3 className="text-xl font-bold">{ebook.title}</h3>
                <p>{ebook.description.slice(0, 100)}...</p>
                <p>Price: ₹{ebook.price}</p>
              </div>
              <div>
                <button
                  onClick={() => handleEdit(ebook)}
                  className="text-blue-500 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(ebook._id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
