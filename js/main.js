// ==============================================
// FINAL VERSION — Counter + Cart Page Match
// ==============================================

// ===== GLOBAL DATA =====
let cart = [];
let selectedColor = null;
let selectedSize = null;
let selectedQty = 1;

// ===== LOAD CART FROM STORAGE =====
function loadCart() {
  const saved = localStorage.getItem('pxlpuff_cart');
  if (saved) {
    cart = JSON.parse(saved);
  } else {
    cart = [];
  }
}

// ===== SAVE CART =====
function saveCart() {
  localStorage.setItem('pxlpuff_cart', JSON.stringify(cart));
}

// ===== UPDATE CART COUNTER =====
function updateCartCounter() {
  const counter = document.querySelector('.cart-counter');
  if (!counter) return;
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total += cart[i].quantity;
  }
  counter.textContent = total;
  counter.style.display = total > 0 ? 'block' : 'none';
}

// ===== ADD TO CART =====
function addToCart(productId, productName, price, color, size, imageClass) {
  loadCart(); // Load latest first
  
  let found = false;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === productId && cart[i].color === color && cart[i].size === size) {
      cart[i].quantity += selectedQty;
      found = true;
      break;
    }
  }
  
  if (!found) {
    cart.push({
      id: productId,
      name: productName,
      price: price,
      color: color,
      size: size,
      quantity: selectedQty,
      imageClass: imageClass
    });
  }
  
  saveCart();
  updateCartCounter();
  alert('✅ Added to cart!');
}

// ===== UPDATE QUANTITY =====
function updateQuantity(index, change) {
  loadCart();
  cart[index].quantity += change;
  if (cart[index].quantity < 1) cart[index].quantity = 1;
  saveCart();
  updateCartCounter();
  renderCartPage();
}

// ===== REMOVE ITEM =====
function removeItem(index) {
  loadCart();
  cart.splice(index, 1);
  saveCart();
  updateCartCounter();
  renderCartPage();
}

// ===== RENDER CART PAGE — THE KEY FUNCTION =====
function renderCartPage() {
  // Only run if on cart page
  const emptyDiv = document.getElementById('empty-cart');
  const itemsDiv = document.getElementById('cart-items');
  const summaryDiv = document.getElementById('cart-summary');
  
  if (!emptyDiv) return; // Not on cart page — exit

  loadCart(); // ← CRITICAL: Always load fresh data first!

  // 🛒 CART IS EMPTY
  if (cart.length === 0) {
    emptyDiv.classList.remove('d-none');
    if (itemsDiv) itemsDiv.classList.add('d-none');
    if (summaryDiv) summaryDiv.classList.add('d-none');
    return;
  }

  // 📦 CART HAS ITEMS
  emptyDiv.classList.add('d-none');
  itemsDiv.classList.remove('d-none');
  summaryDiv.classList.remove('d-none');
  
  itemsDiv.innerHTML = '';
  let totalPrice = 0;

  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    totalPrice += item.price * item.quantity;

    const itemCard = document.createElement('div');
    itemCard.className = 'col-12 mb-3';
    itemCard.innerHTML = `
      <div class="d-flex border rounded p-3 align-items-center">
        <div style="width:80px;height:100px;background:#eee;margin-right:15px;flex-shrink:0;"></div>
        <div class="flex-grow-1">
          <h5 class="mb-1">${item.name}</h5>
          <p class="mb-1 text-muted small">Color: ${item.color} | Size: ${item.size}</p>
          <p class="fw-bold mb-0">₱ ${item.price}</p>
        </div>
        <div class="d-flex align-items-center mx-3">
            <button onclick="updateQuantity(${i}, -1)" class="btn btn-sm" style="border-color: #800020; color: #800020;">−</button>
            <span class="mx-2">${item.quantity}</span>
            <button onclick="updateQuantity(${i}, 1)" class="btn btn-sm" style="border-color: #800020; color: #800020;">+</button>

 
        </div>
        <div class="text-end" style="min-width:100px;">
          <p class="fw-bold mb-1">₱ ${item.price * item.quantity}</p>
          <button onclick="removeItem(${i})" class="btn btn-link btn-sm p-0" style="color: #800020;">Remove</button>
        </div>
      </div>
    `;
    itemsDiv.appendChild(itemCard);
  }

  document.getElementById('subtotal-price').textContent = '₱ ' + totalPrice;
  document.getElementById('total-price').textContent = '₱ ' + totalPrice;
}

// ===== PRODUCT PAGE SETUP =====
function initProductPage() {
  selectedColor = null;
  selectedSize = null;
  selectedQty = 1;

  const colorButtons = document.querySelectorAll('#color-picker button');
  colorButtons.forEach(btn => {
    btn.onclick = function() {
      colorButtons.forEach(b => b.style.border = '3px solid #ccc');
      this.style.border = '3px solid #000';
      selectedColor = this.getAttribute('data-color');
    };
  });

  const sizeButtons = document.querySelectorAll('.size-btn');
  sizeButtons.forEach(btn => {
    btn.onclick = function() {
      sizeButtons.forEach(b => b.style.border = '2px solid #ccc');
      this.style.border = '2px solid #000';
      selectedSize = this.getAttribute('data-size');
    };
  });

  const minus = document.querySelector('.qty-minus');
  const plus = document.querySelector('.qty-plus');
  const qtyDisplay = document.querySelector('.quantity-value');
  if (minus) minus.onclick = () => {
    if (selectedQty > 1) { selectedQty--; qtyDisplay.textContent = selectedQty; }
  };
  if (plus) plus.onclick = () => { selectedQty++; qtyDisplay.textContent = selectedQty; };
}

// ===== START =====
document.addEventListener('DOMContentLoaded', function() {
  loadCart();        // ← Load saved cart FIRST
  updateCartCounter(); // ← Then update counter
  initProductPage();
  renderCartPage();  // ← Then build the cart display
});

