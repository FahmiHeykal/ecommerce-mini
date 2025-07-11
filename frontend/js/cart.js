initPage('user');

// Load cart items
async function loadCart() {
  const cartContainer = document.getElementById('cart-container');
  const cartSummary = document.getElementById('cart-summary');
  const emptyCart = document.getElementById('empty-cart');
  
  if (!cartContainer) return;
  
  showLoading(cartContainer);
  
  try {
    const cart = await fetchWithAuth('/cart');
    
    if (cart.items.length === 0) {
      cartContainer.classList.add('hidden');
      emptyCart.classList.remove('hidden');
      cartSummary.classList.add('hidden');
      return;
    }
    
    displayCartItems(cart.items);
    updateCartSummary(cart.total);
    
    cartContainer.classList.remove('hidden');
    emptyCart.classList.add('hidden');
    cartSummary.classList.remove('hidden');
    
  } catch (error) {
    showToast(error.message, 'error');
    cartContainer.innerHTML = `<p class="text-center text-muted">${error.message}</p>`;
  }
}

// Display cart items
function displayCartItems(items) {
  const cartContainer = document.getElementById('cart-container');
  if (!cartContainer) return;
  
  cartContainer.innerHTML = '';
  
  items.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.product.image || '/assets/placeholder-product.jpg'}" alt="${item.product.name}">
      </div>
      <div class="cart-item-details">
        <h3 class="cart-item-title">${item.product.name}</h3>
        <p class="cart-item-price">${formatRp(item.product.price)}</p>
        <div class="cart-item-quantity">
          <button class="btn btn-outline btn-sm" onclick="updateQuantity('${item._id}', ${item.quantity - 1})">-</button>
          <span>${item.quantity}</span>
          <button class="btn btn-outline btn-sm" onclick="updateQuantity('${item._id}', ${item.quantity + 1})">+</button>
        </div>
      </div>
      <div class="cart-item-actions">
        <button class="btn btn-danger btn-sm" onclick="removeFromCart('${item._id}')">Remove</button>
      </div>
    `;
    cartContainer.appendChild(cartItem);
  });
}

// Update cart summary
function updateCartSummary(total) {
  const cartSummary = document.getElementById('cart-summary');
  if (!cartSummary) return;
  
  cartSummary.innerHTML = `
    <div class="cart-summary-item">
      <span>Subtotal</span>
      <span>${formatRp(total)}</span>
    </div>
    <div class="cart-summary-item">
      <span>Shipping</span>
      <span>${formatRp(0)}</span>
    </div>
    <div class="cart-summary-item font-bold">
      <span>Total</span>
      <span>${formatRp(total)}</span>
    </div>
    <a href="/user/checkout.html" class="btn btn-primary w-full mt-4">Proceed to Checkout</a>
  `;
}

// Update item quantity
async function updateQuantity(itemId, newQuantity) {
  if (newQuantity < 1) {
    removeFromCart(itemId);
    return;
  }
  
  try {
    await fetchWithAuth(`/cart/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity: newQuantity })
    });
    loadCart();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Remove item from cart
async function removeFromCart(itemId) {
  try {
    await fetchWithAuth(`/cart/${itemId}`, {
      method: 'DELETE'
    });
    showToast('Item removed from cart');
    loadCart();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Initialize cart page
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
});