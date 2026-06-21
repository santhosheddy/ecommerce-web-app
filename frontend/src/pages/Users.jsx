import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Users() {

  const [users, setUsers] =
    useState([]);

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

    }
  };

  const deleteUser = async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete this user?"
      );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `http://localhost:5000/api/users/${id}`
      );

      alert("User Deleted");

      fetchUsers();

    } catch (error) {

      console.log(error);

    }
  };

  return (
    <>
      <Navbar />

      <div className="container">

        <h1>
          All Users
        </h1>

        <div className="products">

          {users.map((user) => (

            <div
              className="card"
              key={user._id}
            >

              <div
                className="card-content"
              >

                <h2>
                  {user.name}
                </h2>

                <p>
                  {user.email}
                </p>

                <p>
                  Role:
                  {" "}
                  {user.role}
                </p>

                <button
                  onClick={() =>
                    deleteUser(
                      user._id
                    )
                  }
                >
                  Delete User
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>
    </>
  );
}

export default Users;