import Navbar from "../components/Navbar";

function Profile() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const joinedDate =
    user?.createdAt
      ? new Date(
          user.createdAt
        ).toLocaleDateString()
      : "Not Available";

  return (
    <>
      <Navbar />

      <div className="container">

        <div className="profile-card">

          <h1>My Profile</h1>

          <div className="profile-info">

            <p>
              <strong>Name:</strong>
              {" "}
              {user?.name}
            </p>

            <p>
              <strong>Email:</strong>
              {" "}
              {user?.email}
            </p>

            <p>
              <strong>Role:</strong>
              {" "}
              {user?.role}
            </p>

            <p>
              <strong>Joined Date:</strong>
              {" "}
              {joinedDate}
            </p>

          </div>

        </div>

      </div>
    </>
  );
}

export default Profile;