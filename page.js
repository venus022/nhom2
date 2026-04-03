console.log("Web bán hàng đang chạy");


let products = [];

function loadProducts() {
  fetch("/api/products")
    .then(res => res.json())
    .then(data => {
      products = data;
      renderProducts();
    });
}
function viewDetail(id) {
  fetch(`/api/products/${id}`)    
    .then(res => res.json())
    .then(data => {
      alert(`🛒 ${data.name}\n💰 ${data.price.toLocaleString()}₫`);
    });
}
let cart = [];

const $products = document.getElementById("products");
const $cart = document.getElementById("cart");
const $total = document.getElementById("total");
const $message = document.getElementById("message");
const $cartSection = document.getElementById("cartSection");
const $toggleCart = document.getElementById("toggleCart");

// Ẩn giỏ hàng trên mobile mặc định
if (window.innerWidth <= 1024) {
  $cartSection.classList.add("hidden");
}

$toggleCart.addEventListener("click", () => {
  $cartSection.classList.toggle("hidden");
});

function renderProducts() {
  $products.innerHTML = "";
  products.forEach(product => {
    const div = document.createElement("div");
    div.className = "product-item";
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-img">
      <div class="product-info">
        <strong>${product.name}</strong><br>
        <span class="price">${product.price.toLocaleString('vi-VN')}₫</span>
      </div>
      <button class="add-to-cart" data-id="${product.id}">Thêm vào giỏ</button>
      <button onclick="goToDetail(${product.id})">Xem</button>
    `;
    $products.appendChild(div);
  });
}
function goToDetail(id) {
  window.location.href = `product.html?id=${id}`;
}
function renderCart() {
  $cart.innerHTML = "";
  if (cart.length === 0) {
    $cart.innerHTML = "<li>Giỏ hàng trống</li>";
    $total.textContent = "0₫";
    return;
  }
  let total = 0;
  cart.forEach((item, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-img">
      <div>
        <strong>${item.name}</strong><br>
        <small>Số lượng: <input type="number" min="1" value="${item.quantity}" data-index="${idx}" class="qty-input"></small>
        <br>
        <small>${item.price.toLocaleString('vi-VN')}₫ x ${item.quantity} = <strong>${(item.price * item.quantity).toLocaleString('vi-VN')}₫</strong></small>
      </div>
      <button class="delete-cart" data-index="${idx}">Xóa</button>
    `;
    $cart.appendChild(li);
    total += item.price * item.quantity;
  });
  $total.textContent = total.toLocaleString('vi-VN') + "₫";
}

function showMessage(text) {
  $message.textContent = text;
  setTimeout(() => ($message.textContent = ""), 2000);
}

$products.addEventListener("click", e => {
  if (!e.target.classList.contains("add-to-cart")) return;
  const productId = +e.target.dataset.id;
  const product = products.find(p => p.id === productId);
  const cartItem = cart.find(item => item.id === productId);
  
  if (cartItem) {
    cartItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  renderCart();
  showMessage(`✅ Đã thêm "${product.name}" vào giỏ`);
  
  if (window.innerWidth <= 1024) {
    $cartSection.classList.remove("hidden");
  }
});

$cart.addEventListener("click", e => {
  if (!e.target.classList.contains("delete-cart")) return;
  const idx = +e.target.dataset.index;
  cart.splice(idx, 1);
  renderCart();
  showMessage("Đã xóa khỏi giỏ");
});

$cart.addEventListener("change", e => {
  if (e.target.classList.contains("qty-input")) {
    const idx = +e.target.dataset.index;
    cart[idx].quantity = +e.target.value || 1;
    renderCart();
  }
});

document.getElementById("checkout").addEventListener("click", () => {
  if (cart.length === 0) {
    showMessage("Giỏ hàng trống");
    return;
  }
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  showMessage(`✅ Thanh toán ${total.toLocaleString('vi-VN')}₫ thành công!`);
  cart = [];
  renderCart();
});

document.getElementById("clearCart").addEventListener("click", () => {
  cart = [];
  renderCart();
  showMessage("Đã xóa giỏ hàng");
});

loadProducts();
renderCart(); 