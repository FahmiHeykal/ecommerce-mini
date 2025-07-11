initPage('user');

// Load products
async function loadProducts(search = '') {
  const productsContainer = document.getElementById('products-container');
  if (!productsContainer) return;
  
  showLoading(productsContainer);
  
  try {
    const products = await fetchWithAuth(`/products?search=${search}`);
    displayProducts(products);
  } catch (error) {
    showToast(error.message, 'error');
    productsContainer.innerHTML = `<p class="text-center text-muted">${error.message}</p>`;
  }
}

// Display products
function displayProducts(products) {
  const productsContainer = document.getElementById('products-container');
  if (!productsContainer) return;
  
  if (products.length === 0) {
    productsContainer.innerHTML = `<p class="text-center text-muted">No products found</p>`;
    return;
  }
  
  productsContainer.innerHTML = '';
  
  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'card';
    productCard.innerHTML = `
      <img src="${product.image || '/assets/placeholder-product.jpg'}" alt="${product.name}" class="card-img">
      <div class="card-body">
        <h3 class="card-title">${product.name}</h3>
        <p class="card-text">${product.description?.substring(0, 60)}...</p>
        <div class="flex justify-between items-center">
          <span class="font-semibold">${formatRp(product.price)}</span>
          <button class="btn btn-primary btn-sm" onclick="addToCart('${product._id}')">Add to Cart</button>
        </div>
      </div>
    `;
    productsContainer.appendChild(productCard);
  });
}

// Add to cart
async function addToCart(productId) {
  try {
    await fetchWithAuth('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity: 1 })
    });
    showToast('Product added to cart');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Search products
function setupSearch() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;
  
  const debouncedSearch = debounce((e) => {
    loadProducts(e.target.value);
  }, 300);
  
  searchInput.addEventListener('input', debouncedSearch);
}

// Initialize product page
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  setupSearch();
});