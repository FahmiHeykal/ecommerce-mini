initPage('user');

// Load cart for checkout
async function loadCheckout() {
  try {
    const cart = await fetchWithAuth('/cart');
    
    if (cart.items.length === 0) {
      window.location.href = '/user/index.html';
      return;
    }
    
    displayOrderSummary(cart.items, cart.total);
  } catch (error) {
    showToast(error.message, 'error');
    window.location.href = '/user/cart.html';
  }
}

// Display order summary
function displayOrderSummary(items, total) {
  const orderSummary = document.getElementById('order-summary');
  if (!orderSummary) return;
  
  orderSummary.innerHTML = '';
  
  items.forEach(item => {
    const orderItem = document.createElement('div');
    orderItem.className = 'order-item';
    orderItem.innerHTML = `
      <div class="order-item-image">
        <img src="${item.product.image || '/assets/placeholder-product.jpg'}" alt="${item.product.name}">
      </div>
      <div class="order-item-details">
        <h4 class="order-item-title">${item.product.name}</h4>
        <p class="order-item-price">${formatRp(item.product.price)} × ${item.quantity}</p>
      </div>
      <div class="order-item-total">
        ${formatRp(item.product.price * item.quantity)}
      </div>
    `;
    orderSummary.appendChild(orderItem);
  });
  
  const orderTotal = document.getElementById('order-total');
  if (orderTotal) {
    orderTotal.textContent = formatRp(total);
  }
}

// Handle checkout form submission
document.getElementById('checkout-form')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  
  try {
    const response = await fetchWithAuth('/order/checkout', {
      method: 'POST',
      body: JSON.stringify({
        shippingAddress: data.shippingAddress,
        paymentMethod: data.paymentMethod,
        notes: data.notes
      })
    });
    
    showToast('Order placed successfully!');
    
    setTimeout(() => {
      window.location.href = '/user/orders.html';
    }, 1500);
    
  } catch (error) {
    showToast(error.message, 'error');
  }
});

// Initialize checkout page
document.addEventListener('DOMContentLoaded', () => {
  loadCheckout();
});