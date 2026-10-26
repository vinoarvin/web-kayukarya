/**
 * KayuKarya Furniture Store - Interactive Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initCart();
  initSearch();
  initCategoryFilters();
  initPaymentSelection();
  initOrderForm();
});

// Toast notification helper
function showToast(message, icon = 'shopping_bag') {
  let toast = document.getElementById('kayuToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'kayuToast';
    toast.className = 'kayu-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <span class="material-symbols-outlined text-[22px] text-[#c89d76]">${icon}</span>
    <span class="font-medium text-sm">${message}</span>
  `;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// 1. Cart Management & Counter Sync
function initCart() {
  let cartCount = parseInt(localStorage.getItem('kayukarya_cart_count') || '3', 10);
  const badgeElements = document.querySelectorAll('header a[href*="checkout"] span.bg-secondary, header a[data-path*="checkout"] span.bg-secondary');

  function updateBadge() {
    badgeElements.forEach(badge => {
      badge.textContent = cartCount;
      badge.classList.remove('cart-badge-bump');
      void badge.offsetWidth; // Trigger reflow
      badge.classList.add('cart-badge-bump');
    });
    localStorage.setItem('kayukarya_cart_count', cartCount.toString());
  }

  updateBadge();

  // Attach Add to Cart listener on buttons across pages
  document.querySelectorAll('button, a').forEach(el => {
    const text = el.innerText ? el.innerText.trim().toLowerCase() : '';
    if (text.includes('tambah ke keranjang') || text.includes('pesan paket') || text.includes('beli sekarang')) {
      el.addEventListener('click', (e) => {
        // If it's not a link navigating to checkout
        if (!el.getAttribute('href') || el.getAttribute('href') === '#') {
          e.preventDefault();
          cartCount += 1;
          updateBadge();
          showToast('Produk berhasil ditambahkan ke keranjang belanja!');
        }
      });
    }
  });
}

// 2. Real-time Search Filter for Catalog Page
function initSearch() {
  const searchInputs = document.querySelectorAll('input[type="text"][placeholder*="Cari"]');
  searchInputs.forEach(input => {
    input.addEventListener('keyup', (e) => {
      const query = e.target.value.toLowerCase().trim();
      if (e.key === 'Enter') {
        if (!window.location.pathname.includes('katalog.html')) {
          window.location.href = `katalog.html?q=${encodeURIComponent(query)}`;
          return;
        }
      }

      // Filter catalog cards if on catalog page
      const cards = document.querySelectorAll('article');
      if (cards.length > 0) {
        cards.forEach(card => {
          const text = card.textContent.toLowerCase();
          if (text.includes(query)) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      }
    });
  });

  // Handle URL query parameter on catalog page
  if (window.location.pathname.includes('katalog.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q');
    if (q) {
      searchInputs.forEach(inp => inp.value = q);
      const cards = document.querySelectorAll('article');
      cards.forEach(card => {
        if (card.textContent.toLowerCase().includes(q.toLowerCase())) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    }
  }
}

// 3. Category Filter Buttons
function initCategoryFilters() {
  const filterButtons = document.querySelectorAll('div[class*="overflow-x-auto"] button');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('bg-primary', 'text-on-primary');
        b.classList.add('bg-surface-container', 'text-on-surface-variant');
      });
      btn.classList.remove('bg-surface-container', 'text-on-surface-variant');
      btn.classList.add('bg-primary', 'text-on-primary');

      const filterCategory = btn.textContent.toLowerCase().trim();
      const cards = document.querySelectorAll('article');
      cards.forEach(card => {
        if (filterCategory.includes('semua') || card.textContent.toLowerCase().includes(filterCategory)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// 4. Interactive Payment Selection on Checkout Page
function initPaymentSelection() {
  const paymentMethods = document.querySelectorAll('#payment-card div[role="radiogroup"] > div, div[role="radiogroup"] > div');
  if (paymentMethods.length > 0) {
    paymentMethods.forEach(method => {
      method.addEventListener('click', () => {
        paymentMethods.forEach(m => {
          m.classList.remove('border-primary', 'bg-surface-container-high', 'ring-1', 'ring-primary');
        });
        method.classList.add('border-primary', 'bg-surface-container-high', 'ring-1', 'ring-primary');
        const radio = method.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      });
    });
  }
}

// 5. Order Finalization / Checkout Button
function initOrderForm() {
  const checkoutBtn = document.querySelector('button[type="submit"], a[href*="kontak.html"]');
  if (window.location.pathname.includes('checkout.html') && checkoutBtn) {
    checkoutBtn.addEventListener('click', (e) => {
      // Simulate order processing
      showToast('Pesanan berhasil diproses! Mengarahkan ke halaman konfirmasi...', 'verified');
      setTimeout(() => {
        window.location.href = 'kontak.html';
      }, 900);
    });
  }
}
