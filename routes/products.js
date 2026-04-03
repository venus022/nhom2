const express = require("express");
const fs = require("fs");

const router = express.Router();

// đọc data
function getData() {
  const data = fs.readFileSync("data.json");
  return JSON.parse(data);
}

// lấy tất cả sản phẩm
router.get("/", (req, res) => {
  res.json(getData());
});

// dynamic route
router.get("/:id", (req, res) => {
  const id = +req.params.id;
  const products = getData();
  const product = products.find(p => p.id === id);

  if (!product) return res.status(404).send("Không tìm thấy");

  res.json(product);
});

module.exports = router;