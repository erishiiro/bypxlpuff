document.addEventListener("DOMContentLoaded", function () {

// NEWSLETTER SUBSCRIPTION
const subscribeForm = document.getElementById("subscribeForm");

    if (subscribeForm) {
        subscribeForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const emailInput = subscribeForm.querySelector(
                'input[name="email"]'
            );

            const email = emailInput.value.trim();

            if (!emailInput.checkValidity() || email === "") {
                alert("Please enter a valid email address.");
                emailInput.focus();
                return;
            }

            const recipient = "hello@examplewebsite142.com";

            const subject = encodeURIComponent(
                "Pixel Club Newsletter Subscription"
            );

            const body = encodeURIComponent(
                "Hello by pxlpuff!\n\n" +
                "I would like to subscribe to the Pixel Club newsletter.\n\n" +
                "My email address: " + email
            );

            window.location.href =
                "mailto:" + recipient +
                "?subject=" + subject +
                "&body=" + body;
        });
    }


// ======================================
// PRODUCT ORDER
// ======================================

    const orderButton = document.querySelector(
        ".btn-row a:nth-child(2)"
    );

    if (orderButton) {

        orderButton.addEventListener("click", function (event) {

            event.preventDefault();

            const productName = document.querySelector(
                ".info h1"
            ).textContent.trim();

            const productPrice = document.querySelector(
                ".info .price"
            ).textContent.trim();

            const size = document.querySelector(
                ".size-select .value"
            ).textContent.trim();

            const quantity = document.querySelector(
                ".qty .n"
            ).textContent.trim();

            const recipient = "orders@examplewebsite142.com";

            const subject = encodeURIComponent(
                "Order Request - " + productName
            );

            const body = encodeURIComponent(
                "Hello by pxlpuff!\n\n" +
                "I would like to place an order for the following item:\n\n" +
                "Product: " + productName + "\n" +
                "Price: " + productPrice + "\n" +
                "Size: " + size + "\n" +
                "Quantity: " + quantity + "\n\n" +
                "Please contact me regarding the next steps for my order.\n\n" +
                "Thank you!"
            );

            window.location.href =
                "mailto:" + recipient +
                "?subject=" + subject +
                "&body=" + body;

        });
    }


// ======================================
// PRODUCT SEARCH + RECENT SEARCHES
// ======================================

const searchForm = document.getElementById("searchForm");

if (searchForm) {

    const searchInput = searchForm.querySelector('input[name="q"]');
    const recentContainer = document.querySelector(".chips");
    const clearButton = document.querySelector(".clear-all");

    // PRODUCT DATABASE
    const products = [
        {
            name: "Do Good Work Tee",
            keywords: ["do good work", "good work", "do good"],
            link: "do-good-work-tee.html"
        },
        {
            name: "Don't Be Late Tee",
            keywords: ["don't be late", "dont be late", "be late"],
            link: "dont-be-late-tee.html"
        },
        {
            name: "Everyday Comfort Tee",
            keywords: ["everyday comfort", "comfort"],
            link: "everyday-comfort-tee.html"
        }
    ];

    // LOAD SEARCH HISTORY
    let recentSearches = [];

    try {
        recentSearches = JSON.parse(
            localStorage.getItem("recentSearches")
        ) || [];
    } catch (error) {
        recentSearches = [];
    }

    // DISPLAY SEARCH HISTORY
    function displayRecentSearches() {

        if (!recentContainer) return;

        recentContainer.innerHTML = "";

        recentSearches.forEach(function(search) {

            const chip = document.createElement("button");

            chip.type = "button";
            chip.className = "chip";
            chip.textContent = "× " + search;

            chip.addEventListener("click", function() {
                searchInput.value = search;
                searchForm.requestSubmit();
            });

            recentContainer.appendChild(chip);

        });

    }

    // SAVE SEARCH HISTORY
    function saveRecentSearch(search) {

        recentSearches = recentSearches.filter(function(item) {
            return item.toLowerCase() !== search.toLowerCase();
        });

        recentSearches.unshift(search);
        recentSearches = recentSearches.slice(0, 5);

        localStorage.setItem(
            "recentSearches",
            JSON.stringify(recentSearches)
        );

        displayRecentSearches();

    }

    // SEARCH PRODUCTS
    searchForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const searchTerm = searchInput.value
            .trim()
            .toLowerCase()
            .replace(/[’]/g, "'");

        if (searchTerm === "") {
            alert("Please enter a product name.");
            searchInput.focus();
            return;
        }

        const matchedProduct = products.find(function(product) {

            const productName = product.name.toLowerCase();

            return productName.includes(searchTerm) ||
                product.keywords.some(function(keyword) {
                    return keyword.includes(searchTerm) ||
                        searchTerm.includes(keyword);
                });

        });

        if (matchedProduct) {

            // SAVE SEARCH BEFORE REDIRECTING
            saveRecentSearch(matchedProduct.name);

            // OPEN PRODUCT PAGE
            window.location.href = matchedProduct.link;

        } else {

            alert("Sorry! No products found. Please try another search.");

        }

    });

    // CLEAR ALL SEARCH HISTORY
    if (clearButton) {

        clearButton.addEventListener("click", function(event) {

            event.preventDefault();

            recentSearches = [];

            localStorage.removeItem("recentSearches");

            displayRecentSearches();

        });

    }

    // DISPLAY HISTORY WHEN PAGE LOADS
    displayRecentSearches();

}
 });
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

