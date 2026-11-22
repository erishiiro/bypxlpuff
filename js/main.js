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
const menu = document.querySelector('.hamburger-menu') 
          || document.querySelector('.mobile-nav') 
          || document.querySelector('.menu');

const menuButton = document.querySelector('.hamburger-btn') 
                || document.querySelector('.menu-toggle');

if (!menu) {
  console.log('Menu not found — check your class names!');
  return;
}

menu.classList.toggle('open');

const isOpen = menu.classList.contains('open');
if (menuButton) {
  menuButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}
}

// ===== ⌨️ KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(e) {
const activeTag = document.activeElement.tagName;
if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return;

switch(e.key.toLowerCase()) {
  case 'tab':
    e.preventDefault();
    toggleHamburgerMenu();
    break;
  case 'h':
    e.preventDefault();
    window.location.href = 'index.html';
    break;
  case 's':
    e.preventDefault();
    window.location.href = 'shop.html';
    break;
  case 'e':
    e.preventDefault();
    window.location.href = 'contact.html';
    break;
  case 'w':
    e.preventDefault();
    window.location.href = 'wishlist.html';
    break;
  case 'c':
    e.preventDefault();
    window.location.href = 'cart.html';
    break;
  case 'p':
    e.preventDefault();
    window.location.href = 'privacy-policy.html';
    break;
  case '/':
    e.preventDefault();
    window.location.href = 'search.html';
    break;
  case 'x':
    e.preventDefault();
    alert('© 2026 by pxlpuff — All Rights Reserved');
    break;
}
});

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', function() {
updateWishlistCounter();
updateCartCounter();
markActiveHearts();   
attachHeartListeners();
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

document.addEventListener('DOMContentLoaded', function () {

  document.querySelectorAll('.order-now-btn').forEach(function (button) {

    button.addEventListener('click', function () {

      const productInfo = button.closest('.info');
      if (!productInfo) return;

      const productName = productInfo.querySelector('h1').textContent.trim();

      const priceText = productInfo.querySelector('.price').textContent;
      const price = Number(priceText.replace(/[^\d.]/g, ''));

      const selectedColorButton =
      productInfo.querySelector('#color-picker button[style*="border: 3px solid rgb(0, 0, 0)"]');

      const selectedSizeButton =
        productInfo.querySelector('.size-btn.selected');

      const quantity = Number(
        productInfo.querySelector('.quantity-value').textContent
      );

      if (!selectedColorButton) {
        alert('Please select a color first!');
        return;
      }

      if (!selectedSizeButton) {
        alert('Please select a size first!');
        return;
      }

      const color = selectedColorButton.dataset.color;
      const size = selectedSizeButton.dataset.size;
      const total = price * quantity;

      const emailTo = 'orders@examplewebsite142.com';

      const subject = encodeURIComponent('New Order — ' + productName);

      const body = encodeURIComponent(
        'Hello by pxlpuff Team!\n\n' +
        'I would like to order the following item:\n\n' +
        'Product: ' + productName + '\n' +
        'Color: ' + color + '\n' +
        'Size: ' + size + '\n' +
        'Quantity: ' + quantity + '\n' +
        'Price: ₱' + price + ' each\n' +
        'Total: ₱' + total + '\n\n' +
        'Your Name:\n' +
        'Contact Number:\n' +
        'Delivery Address:\n\n' +
        'Thank you!'
      );

      window.open(
        'https://mail.google.com/mail/?view=cm&to=' +
        encodeURIComponent(emailTo) +
        '&su=' + subject +
        '&body=' + body,
        '_blank'
      );

    });

  });

});
