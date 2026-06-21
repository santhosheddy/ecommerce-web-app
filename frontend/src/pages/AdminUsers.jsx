import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    role: "user",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/users"
      );
      setUsers(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch users");
    }
  };

  const startEdit = (user) => {
    setEditingId(user._id);
    setEditData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const updateUser = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/${editingId}`,
        editData
      );
      alert("User updated successfully");
      setEditingId(null);
      fetchUsers();
    } catch (error) {
      console.log(error);
      alert("Failed to update user");
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(
          `http://localhost:5000/api/users/${id}`
        );
        alert("User deleted successfully");
        fetchUsers();
      } catch (error) {
        console.log(error);
        alert("Failed to delete user");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>👥 Manage Users</h1>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  {editingId === user._id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          name="name"
                          value={editData.name}
                          onChange={handleChange}
                          className="edit-input"
                        />
                      </td>
                      <td>
                        <input
                          type="email"
                          name="email"
                          value={editData.email}
                          onChange={handleChange}
                          className="edit-input"
                        />
                      </td>
                      <td>
                        <select
                          name="role"
                          value={editData.role}
                          onChange={handleChange}
                          className="edit-input"
                        >
                          <option value="user">User</option>
                          <option value="admin">
                            Admin
                          </option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="save-btn"
                          onClick={updateUser}
                        >
                          Save
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={() =>
                            setEditingId(null)
                          }
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span
                          style={{
                            color:
                              user.role === "admin"
                                ? "#f59e0b"
                                : "#60a5fa",
                            fontWeight: "bold",
                          }}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <button
                          className="edit-btn"
                          onClick={() => startEdit(user)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() =>
                            deleteUser(user._id)
                          }
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default AdminUsers;