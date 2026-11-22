// =====================================================
// 🛍️ by pxlpuff — Main JavaScript File
// =====================================================

// ===== WISHLIST HELPERS =====
function getWishlist() {
return JSON.parse(localStorage.getItem('pxlpuff_wishlist') || '[]');
}

function saveWishlist(list) {
localStorage.setItem('pxlpuff_wishlist', JSON.stringify(list));
updateWishlistCounter();
}

function updateWishlistCounter() {
const count = getWishlist().length;
document.querySelectorAll('.wishlist-count').forEach(el => {
  el.textContent = count;
  el.style.display = count > 0 ? 'inline-flex' : 'none';
});
}

// ===== CART HELPERS =====
function getCart() {
return JSON.parse(localStorage.getItem('pxlpuff_cart') || '[]');
}

function saveCart(cart) {
localStorage.setItem('pxlpuff_cart', JSON.stringify(cart));
updateCartCounter();
}

function updateCartCounter() {
const cart = getCart();
const total = cart.reduce((sum, item) => sum + item.quantity, 0);
document.querySelectorAll('.cart-counter').forEach(el => {
  el.textContent = total;
  el.style.display = total > 0 ? 'inline-flex' : 'none';
});
}

// ===== SHOP PAGE — HEART BUTTONS =====
function markActiveHearts() {
const wishlist = getWishlist();
document.querySelectorAll('.heart-btn').forEach(btn => {
  const id = btn.getAttribute('data-id');
  const isInList = wishlist.includes(id);
  
  if (isInList) {
    btn.classList.add('active');
    btn.querySelector('svg').setAttribute('fill', '#e63946');
    btn.querySelector('svg').setAttribute('stroke', '#e63946');
  } else {
    btn.classList.remove('active');
    btn.querySelector('svg').setAttribute('fill', 'none');
    btn.querySelector('svg').setAttribute('stroke', 'currentColor');
  }
});
}

function attachHeartListeners() {
document.querySelectorAll('.heart-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const productId = this.getAttribute('data-id');
    let wishlist = getWishlist();
    
    if (wishlist.includes(productId)) {
      wishlist = wishlist.filter(id => id !== productId);
    } else {
      wishlist.push(productId);
    }
    
    saveWishlist(wishlist);
    markActiveHearts();
  });
});
}

// ===== HAMBURGER MENU TOGGLE =====
function toggleHamburgerMenu() {
  var menu = document.querySelector('.hamburger-menu')
            || document.querySelector('.mobile-nav')
            || document.querySelector('.menu');
  var menuButton = document.querySelector('.hamburger-btn')
                || document.querySelector('.menu-toggle');

  if (!menu) {
    window.location.href = 'menu.html';
    return;
  }

  menu.classList.toggle('open');
  var isOpen = menu.classList.contains('open');
  if (menuButton) {
    menuButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }
}

function attachHamburgerListener() {
  var menuButton = document.querySelector('.hamburger-btn')
                || document.querySelector('.menu-toggle');
  if (!menuButton || menuButton.dataset.menuBound === '1') return;
  menuButton.dataset.menuBound = '1';
  menuButton.addEventListener('click', function (e) {
    e.preventDefault();
    toggleHamburgerMenu();
  });
}

// ===== ⌨️ KEYBOARD SHORTCUTS =====
// M  Hamburger Menu | H Home | E Contact | W Wishlist
// C  Cart | P Privacy | / Search | X Copyright | S Shop
// Tab is left alone for normal focus navigation.
document.addEventListener('keydown', function(e) {
  var activeTag = document.activeElement.tagName;
  if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return;
  if (e.key === 'Tab' || e.ctrlKey || e.metaKey || e.altKey) return;

  switch (e.key.toLowerCase()) {
    case 'm': // Hamburger Menu
      e.preventDefault();
      toggleHamburgerMenu();
      break;
    case 'h': // Home Page
      e.preventDefault();
      window.location.href = 'index.html';
      break;
    case 'e': // Contact Us
      e.preventDefault();
      window.location.href = 'contact.html';
      break;
    case 'w': // Wishlist
      e.preventDefault();
      window.location.href = 'wishlist.html';
      break;
    case 'c': // Cart
      e.preventDefault();
      window.location.href = 'cart.html';
      break;
    case 'p': // Privacy Policy
      e.preventDefault();
      window.location.href = 'privacy-policy.html';
      break;
    case '/': // Search
      e.preventDefault();
      window.location.href = 'search.html';
      break;
    case 'x': // Copyright
      e.preventDefault();
      alert('© 2026 by pxlpuff — All Rights Reserved');
      break;
    case 's': // Shop
      e.preventDefault();
      window.location.href = 'shop.html';
      break;
  }
});

// ===== ADD TO CART (product pages) =====
function addToCart(productId, name, price, color, size, imageSrc) {
  color = color || (typeof window.selectedColor !== 'undefined' ? window.selectedColor : '');
  size = size || (typeof window.selectedSize !== 'undefined' ? window.selectedSize : '');
  imageSrc = imageSrc || (typeof window.currentImageSrc !== 'undefined' ? window.currentImageSrc : '');

  if (!color) { alert('Select a color first!'); return; }
  if (!size) { alert('Select a size first!'); return; }

  var qty = Number(typeof window.quantity !== 'undefined' ? window.quantity : 1) || 1;
  var cart = getCart();
  var uniqueKey = productId + '-' + color + '-' + size;
  var existingIndex = cart.findIndex(function (item) { return item.key === uniqueKey; });

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += qty;
  } else {
    cart.push({
      key: uniqueKey,
      id: productId,
      name: name,
      price: price,
      color: color,
      size: size,
      quantity: qty,
      image: imageSrc
    });
  }

  saveCart(cart);
  alert('✅ Added to cart!\n\nItem: ' + name + '\nColor: ' + color + '\nSize: ' + size + '\nQty: ' + qty);
}

// ===== PRODUCT PAGE WISHLIST (#wish-button) =====
function initProductWishlist() {
  var wishBtn = document.getElementById('wish-button');
  if (!wishBtn) return;

  var heartIcon = document.getElementById('heart-icon');
  var wishText = document.getElementById('wish-text');
  var productId = wishBtn.getAttribute('data-id');
  if (!productId) return;

  function isWished() {
    return getWishlist().indexOf(productId) !== -1;
  }

  function updateWishlistUI() {
    var on = isWished();
    if (heartIcon) {
      heartIcon.textContent = on ? '♥' : '♡';
      heartIcon.style.color = on ? '#800020' : 'inherit';
    }
    if (wishText) {
      wishText.textContent = on ? 'In Wishlist' : 'Add to Wishlist';
    }
  }

  updateWishlistUI();

  wishBtn.addEventListener('click', function () {
    var list = getWishlist();
    if (list.indexOf(productId) !== -1) {
      list = list.filter(function (id) { return id !== productId; });
    } else {
      list.push(productId);
    }
    saveWishlist(list);
    updateWishlistUI();
  });
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', function() {
updateWishlistCounter();
updateCartCounter();
markActiveHearts();   
attachHeartListeners();
initProductWishlist();
attachHamburgerListener();
});


// ==========================================
// SEARCH + RECENT SEARCHES
// ==========================================

function initSearchPage() {

const searchForm = document.getElementById('searchForm');

if (!searchForm) return;

const searchInput = searchForm.querySelector('input[name="q"]');
const recentContainer = document.querySelector('.chips');
const clearButton = document.querySelector('.clear-all');

// PRODUCT DATABASE
const products = [
  {
    name: 'Do Good Work Tee',
    keywords: ['do good work', 'good work', 'do good'],
    link: 'do-good-work-tee.html'
  },
  {
    name: "Don't Be Late Tee",
    keywords: ["don't be late", 'dont be late', 'be late'],
    link: 'dont-be-late-tee.html'
  },
  {
    name: 'Everyday Comfort Tee',
    keywords: ['everyday comfort', 'comfort', 'everyday'],
    link: 'everyday-comfort-tee.html'
  }
];

// LOAD RECENT SEARCHES
let recentSearches = [];

try {
  recentSearches = JSON.parse(
    localStorage.getItem('recentSearches') || '[]'
  );
} catch (error) {
  recentSearches = [];
}

// DISPLAY RECENT SEARCHES
function displayRecentSearches() {

  if (!recentContainer) return;

  recentContainer.innerHTML = '';

  recentSearches.forEach(search => {

    const chip = document.createElement('button');

    chip.type = 'button';
    chip.className = 'chip';
    chip.textContent = '× ' + search;

    chip.addEventListener('click', function() {
      searchInput.value = search;
      searchForm.requestSubmit();
    });

    recentContainer.appendChild(chip);

  });

}

// SAVE RECENT SEARCHES
function saveRecentSearch(search) {

  recentSearches = recentSearches.filter(
    item => item.toLowerCase() !== search.toLowerCase()
  );

  recentSearches.unshift(search);
  recentSearches = recentSearches.slice(0, 5);

  localStorage.setItem(
    'recentSearches',
    JSON.stringify(recentSearches)
  );

  displayRecentSearches();

}

// SEARCH PRODUCTS
searchForm.addEventListener('submit', function(event) {

  event.preventDefault();

  const searchTerm = searchInput.value
    .trim()
    .toLowerCase()
    .replace(/[’]/g, "'");

  if (!searchTerm) {
    alert('Please enter a product name.');
    searchInput.focus();
    return;
  }

  const match = products.find(product => {

    return product.name.toLowerCase().includes(searchTerm) ||
      product.keywords.some(keyword =>
        keyword.includes(searchTerm) ||
        searchTerm.includes(keyword)
      );

  });

  if (match) {

    saveRecentSearch(match.name);
    window.location.href = match.link;

  } else {

    alert('Sorry! No products found. Please try another search.');

  }

});

// CLEAR ALL SEARCHES
if (clearButton) {

  clearButton.addEventListener('click', function(event) {

    event.preventDefault();

    recentSearches = [];

    localStorage.removeItem('recentSearches');

    displayRecentSearches();

  });

}

// DISPLAY SEARCHES WHEN PAGE LOADS
displayRecentSearches();

}

// INITIALIZE SEARCH
document.addEventListener('DOMContentLoaded', function() {
initSearchPage();
});



 

// ======================================
// ✨ UNIVERSAL ORDER NOW FUNCTION
// ======================================

function orderNow() {
  var productInfo = document.querySelector('.product-detail .info') || document.querySelector('.info');
  if (!productInfo) {
    alert('Could not find product details.');
    return;
  }

  var nameEl = productInfo.querySelector('h1');
  var priceEl =
    productInfo.querySelector('.sale-price') ||
    productInfo.querySelector('.price');
  var productName = nameEl ? nameEl.textContent.trim() : 'Product';
  var price = priceEl ? Number(priceEl.textContent.replace(/[^\d.]/g, '')) : 0;

  var colorBtn =
    productInfo.querySelector('#color-picker button[aria-pressed="true"]') ||
    productInfo.querySelector('#color-picker button.selected') ||
    productInfo.querySelector('#color-picker button[data-color]');

  var sizeBtn = productInfo.querySelector('.size-btn.selected');
  var qtyEl = productInfo.querySelector('.quantity-value');

  var color =
    (typeof window.selectedColor !== 'undefined' && window.selectedColor) ||
    (colorBtn && colorBtn.getAttribute('data-color'));

  var size =
    (typeof window.selectedSize !== 'undefined' && window.selectedSize) ||
    (sizeBtn && sizeBtn.getAttribute('data-size'));

  var qty = Number(
    (typeof window.quantity !== 'undefined' ? window.quantity : null) ||
    (qtyEl && qtyEl.textContent) ||
    1
  );

  if (!color) {
    alert('Please select a color first!');
    return;
  }

  if (!size) {
    alert('Please select a size first!');
    return;
  }

  var total = price * qty;
  var emailTo = 'orders@examplewebsite142.com';
  var subject = encodeURIComponent('New Order — ' + productName);
  var LINE = '%0D%0A';
  var body =
    'Hello by pxlpuff Team!' + LINE + LINE +
    'I would like to order the following item:' + LINE + LINE +
    'Product: ' + productName + LINE +
    'Color: ' + color + LINE +
    'Size: ' + size + LINE +
    'Quantity: ' + qty + LINE +
    'Price: ₱' + price + ' each' + LINE +
    'Total: ₱' + total + LINE + LINE +
    'Your Name:' + LINE +
    'Contact Number:' + LINE +
    'Delivery Address:' + LINE + LINE +
    'Thank you!';

  // Open default/web email compose (same pattern as cart checkout)
  window.open(
    'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(emailTo) +
    '&su=' + subject +
    '&body=' + body,
    '_blank'
  );
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.order-now-btn').forEach(function (button) {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      orderNow();
    });
  });
});
