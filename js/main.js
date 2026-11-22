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
