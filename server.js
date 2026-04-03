const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("."));

// import routes
const productRoutes = require("./routes/products");

// dùng route
app.use("/api/products", productRoutes);

app.listen(3000, () => {
  console.log("Server chạy http://localhost:3000/nhom2.html");
});