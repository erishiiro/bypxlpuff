// ==============================================
// PXLPUFF CART — COMPLETE & WORKING
// ==============================================

// ===== GET CART FROM STORAGE =====
function getCart() {
  const saved = localStorage.getItem('pxlpuff_cart');
  return saved ? JSON.parse(saved) : [];
}

// ===== SAVE CART TO STORAGE =====
function saveCart(cart) {
  localStorage.setItem('pxlpuff_cart', JSON.stringify(cart));
  updateCartIcon();
  renderCart();
}

// ===== UPDATE CART ICON NUMBER =====
function updateCartIcon() {
  const cart = getCart();
  const counter = document.querySelector('.cart-counter');
  if (!counter) return;
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  counter.textContent = total;
  counter.style.display = total > 0 ? 'flex' : 'none';
}

// ===== CHANGE QUANTITY =====
window.changeQuantity = function(index, amount) {
  const cart = getCart();
  cart[index].quantity += amount;
  if (cart[index].quantity < 1) cart[index].quantity = 1;
  saveCart(cart);
};

// ===== REMOVE ITEM =====
window.removeItem = function(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
};

// ===== RENDER CART — THIS SHOWS EVERYTHING! =====
function renderCart() {
  const cart = getCart();
  const emptyMsg = document.getElementById('empty-cart');
  const itemsContainer = document.getElementById('cart-items');
  const summary = document.getElementById('cart-summary');
  const subtotalEl = document.getElementById('subtotal-price');
  const totalEl = document.getElementById('total-price');

  if (!emptyMsg) return; // Not on cart page

  // 🛒 CART IS EMPTY
  if (cart.length === 0) {
    emptyMsg.style.display = 'block';
    if (itemsContainer) itemsContainer.classList.add('d-none');
    if (summary) summary.classList.add('d-none');
    return;
  }

  // 📦 CART HAS ITEMS
  emptyMsg.style.display = 'none';
  if (itemsContainer) itemsContainer.classList.remove('d-none');
  if (summary) summary.classList.remove('d-none');
  
  itemsContainer.innerHTML = '';
  let totalPrice = 0;

  cart.forEach((item, i) => {
    totalPrice += item.price * item.quantity;

    itemsContainer.innerHTML += `
      <div class="col-12">
        <div class="card mb-3">
          <div class="card-body d-flex align-items-center">
            <!-- ✅ PRODUCT IMAGE -->
            <img 
              src="${item.image}" 
              alt="${item.name}" 
              style="width: 80px; height: 100px; object-fit: cover; border-radius: 4px; margin-right: 15px; background: #f5f5f5;"
              onerror="this.src='images/placeholder.png';"
            >
            
            <div class="flex-grow-1">
              <h5 class="mb-1">${item.name}</h5>
              <p class="text-muted small mb-0">Color: ${item.color} | Size: ${item.size}</p>
              <p class="fw-bold mt-1 mb-0">₱ ${item.price}</p>
            </div>
            
            <div class="d-flex align-items-center mx-3">
              <button onclick="changeQuantity(${i}, -1)" class="btn btn-sm" style="border-color: #800020; color: #800020;">−</button>
              <span class="mx-3">${item.quantity}</span>
              <button onclick="changeQuantity(${i}, 1)" class="btn btn-sm" style="border-color: #800020; color: #800020;">+</button>
            </div>
            
            <div class="text-end" style="min-width: 110px;">
              <p class="fw-bold mb-1">₱ ${item.price * item.quantity}</p>
              <button onclick="removeItem(${i})" class="btn btn-link text-decoration-none p-0" style="color: #800020;">Remove</button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  if (subtotalEl) subtotalEl.textContent = '₱ ' + totalPrice;
  if (totalEl) totalEl.textContent = '₱ ' + totalPrice;
}

// ===== RUN WHEN PAGE LOADS =====
document.addEventListener('DOMContentLoaded', function() {
  updateCartIcon();
  renderCart(); // ✅ Builds your cart page automatically!
});
