// by pxlpuff — product colour picker
// Click a swatch → update main image (+ thumbs when provided)

(function () {
  function setSelected(buttons, active) {
    buttons.forEach(function (btn) {
      var on = btn === active;
      btn.style.border = on ? '3px solid #000' : '3px solid #ccc';
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.classList.toggle('selected', on);
    });
  }

  function formatPrice(value) {
    var n = Number(value);
    if (!n && n !== 0) return value;
    return Number.isInteger(n) ? String(n) : n.toFixed(2);
  }

  function applyPrice(btn) {
    var priceBox = document.getElementById('product-price');
    if (!priceBox) return;

    var price = btn.getAttribute('data-price');
    var discount = btn.getAttribute('data-discount');
    if (!price) return;

    window.productPrice = Number(price);

    if (discount) {
      priceBox.innerHTML =
        '<p class="price sale-prices">' +
          '<span class="original-price">₱ 499</span>' +
          '<span class="sale-price">₱ ' + formatPrice(price) + '</span>' +
        '</p>' +
        '<p class="discount-label">' + discount + '</p>';
    } else {
      priceBox.innerHTML = '<p class="price">₱ ' + formatPrice(price) + '</p>';
    }
  }

  function applyColor(btn) {
    var color = btn.getAttribute('data-color');
    var image = btn.getAttribute('data-image');
    var thumb1 = btn.getAttribute('data-thumb-1');
    var thumb2 = btn.getAttribute('data-thumb-2');

    var mainImg = document.querySelector('#main-product-image img');
    if (mainImg && image) {
      mainImg.src = image;
      if (color) {
        var baseAlt = mainImg.alt.replace(/\s*-\s*[^-]+$/, '');
        mainImg.alt = baseAlt + ' - ' + color;
      }
    }

    var thumbs = document.querySelectorAll('.thumbs .thumb');
    if (thumbs[0] && thumb1) thumbs[0].src = thumb1;
    if (thumbs[1] && thumb2) thumbs[1].src = thumb2;

    applyPrice(btn);

    // Keep product-page cart / order handlers in sync
    if (typeof window.selectedColor !== 'undefined') window.selectedColor = color;
    if (typeof window.currentImageSrc !== 'undefined') window.currentImageSrc = image;
  }

  function initColorPicker() {
    var picker = document.getElementById('color-picker');
    if (!picker) return;

    var buttons = picker.querySelectorAll('button[data-color]');
    if (!buttons.length) return;

    buttons.forEach(function (btn) {
      btn.setAttribute('aria-label', 'Select colour ' + (btn.getAttribute('data-color') || ''));
      btn.addEventListener('click', function () {
        setSelected(buttons, btn);
        applyColor(btn);
      });
    });

    var selected =
      picker.querySelector('button[aria-pressed="true"]') ||
      Array.prototype.find.call(buttons, function (b) {
        return (b.style.border || '').indexOf('rgb(0, 0, 0)') !== -1 ||
          (b.getAttribute('style') || '').indexOf('#000') !== -1;
      }) ||
      buttons[0];

    setSelected(buttons, selected);
    applyColor(selected);
  }

  document.addEventListener('DOMContentLoaded', initColorPicker);
})();
