// require("dotenv").config();
// const userRoutes =
//   require("./routes/userRoutes");
//   const userRoutes =
// require("./routes/userRoutes");

// const app = require("./app");
// const connectDB = require("./config/db");

// connectDB();

// const PORT = process.env.PORT || 5000;
// app.use(
//   "/api/users",
//   userRoutes
// ); 

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// app.use(
//   "/api/address",
//   require("./routes/addressRoutes")
// );

// app.use(
//   "/api/orders",
//   require("./routes/orderRoutes")
// );

// app.use(
//   "/api/users",
//   userRoutes
// );

require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});