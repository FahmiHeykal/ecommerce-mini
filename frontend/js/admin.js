initPage('admin');

// Load admin dashboard stats
async function loadDashboardStats() {
  const statsContainer = document.getElementById('stats-container');
  if (!statsContainer) return;
  
  showLoading(statsContainer);
  
  try {
    const stats = await fetchWithAuth('/admin/stats');
    displayDashboardStats(stats);
  } catch (error) {
    showToast(error.message, 'error');
    statsContainer.innerHTML = `<p class="text-center text-muted">${error.message}</p>`;
  }
}

// Display dashboard stats
function displayDashboardStats(stats) {
  const statsContainer = document.getElementById('stats-container');
  if (!statsContainer) return;
  
  statsContainer.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon bg-blue-100 text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
        <div class="stat-content">
          <h3 class="stat-title">Total Products</h3>
          <p class="stat-value">${stats.totalProducts}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon bg-green-100 text-green-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
        </div>
        <div class="stat-content">
          <h3 class="stat-title">Total Orders</h3>
          <p class="stat-value">${stats.totalOrders}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon bg-purple-100 text-purple-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div class="stat-content">
          <h3 class="stat-title">Total Users</h3>
          <p class="stat-value">${stats.totalUsers}</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon bg-yellow-100 text-yellow-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        </div>
        <div class="stat-content">
          <h3 class="stat-title">Revenue</h3>
          <p class="stat-value">${formatRp(stats.totalRevenue)}</p>
        </div>
      </div>
    </div>
    
    <div class="recent-orders mt-8">
      <h3 class="text-lg font-semibold mb-4">Recent Orders</h3>
      <table class="table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody id="recent-orders-list"></tbody>
      </table>
    </div>
  `;
  
  const recentOrdersList = document.getElementById('recent-orders-list');
  
  stats.recentOrders.forEach(order => {
    const orderRow = document.createElement('tr');
    orderRow.innerHTML = `
      <td>${order._id.substring(0, 8)}</td>
      <td>${order.user.name}</td>
      <td>${new Date(order.createdAt).toLocaleDateString()}</td>
      <td>${formatRp(order.total)}</td>
      <td>
        <span class="badge ${getStatusBadgeClass(order.status)}">
          ${order.status}
        </span>
      </td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="viewOrderDetail('${order._id}')">View</button>
      </td>
    `;
    recentOrdersList.appendChild(orderRow);
  });
}

// View order detail
function viewOrderDetail(orderId) {
  window.location.href = `/admin/order-detail.html?id=${orderId}`;
}

// Add product form handler
document.getElementById('add-product-form')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  
  try {
    const response = await fetch(`${API_BASE_URL}/admin/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add product');
    }
    
    showToast('Product added successfully');
    form.reset();
    document.getElementById('image-preview').src = '/assets/placeholder-product.jpg';
    
  } catch (error) {
    showToast(error.message, 'error');
  }
});

// Preview image before upload
document.getElementById('image')?.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      document.getElementById('image-preview').src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Load product for editing
async function loadProductForEdit() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  if (!productId) {
    window.location.href = '/admin/add_product.html';
    return;
  }
  
  const form = document.getElementById('edit-product-form');
  if (!form) return;
  
  showLoading(form);
  
  try {
    const product = await fetchWithAuth(`/admin/products/${productId}`);
    populateEditForm(product);
  } catch (error) {
    showToast(error.message, 'error');
    window.location.href = '/admin/add_product.html';
  }
}

// Populate edit form
function populateEditForm(product) {
  const form = document.getElementById('edit-product-form');
  if (!form) return;
  
  form.querySelector('[name="name"]').value = product.name;
  form.querySelector('[name="description"]').value = product.description;
  form.querySelector('[name="price"]').value = product.price;
  form.querySelector('[name="stock"]').value = product.stock;
  
  const imagePreview = document.getElementById('image-preview');
  if (product.image) {
    imagePreview.src = product.image;
  }
}

// Update product form handler
document.getElementById('edit-product-form')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  if (!productId) {
    window.location.href = '/admin/add_product.html';
    return;
  }
  
  const form = e.target;
  const formData = new FormData(form);
  
  try {
    const response = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update product');
    }
    
    showToast('Product updated successfully');
    
  } catch (error) {
    showToast(error.message, 'error');
  }
});

// Load admin orders
async function loadAdminOrders() {
  const ordersContainer = document.getElementById('orders-container');
  if (!ordersContainer) return;
  
  showLoading(ordersContainer);
  
  try {
    const orders = await fetchWithAuth('/admin/orders');
    displayAdminOrders(orders);
  } catch (error) {
    showToast(error.message, 'error');
    ordersContainer.innerHTML = `<p class="text-center text-muted">${error.message}</p>`;
  }
}

// Display admin orders
function displayAdminOrders(orders) {
  const ordersContainer = document.getElementById('orders-container');
  if (!ordersContainer) return;
  
  if (orders.length === 0) {
    ordersContainer.innerHTML = `
      <div class="text-center py-8">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4 text-gray-400">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h3 class="text-lg font-semibold mb-2">No orders found</h3>
        <p class="text-muted mb-4">There are no orders to display</p>
      </div>
    `;
    return;
  }
  
  ordersContainer.innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Customer</th>
          <th>Date</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody id="orders-list"></tbody>
    </table>
  `;
  
  const ordersList = document.getElementById('orders-list');
  
  orders.forEach(order => {
    const orderRow = document.createElement('tr');
    orderRow.innerHTML = `
      <td>${order._id.substring(0, 8)}</td>
      <td>${order.user.name}</td>
      <td>${new Date(order.createdAt).toLocaleDateString()}</td>
      <td>${formatRp(order.total)}</td>
      <td>
        <select class="form-control form-control-sm" onchange="updateOrderStatus('${order._id}', this.value)" ${order.status === 'completed' || order.status === 'cancelled' ? 'disabled' : ''}>
          <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
          <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
          <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
          <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="viewOrderDetail('${order._id}')">View</button>
      </td>
    `;
    ordersList.appendChild(orderRow);
  });
}

// Update order status
async function updateOrderStatus(orderId, status) {
  try {
    await fetchWithAuth(`/admin/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    showToast('Order status updated');
  } catch (error) {
    showToast(error.message, 'error');
    loadAdminOrders(); // Reload to reset status
  }
}

// Initialize admin pages
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('dashboard.html')) {
    loadDashboardStats();
  } else if (window.location.pathname.includes('orders.html')) {
    loadAdminOrders();
  } else if (window.location.pathname.includes('edit_product.html')) {
    loadProductForEdit();
  }
});