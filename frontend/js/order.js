initPage('user');

// Load user orders
async function loadOrders() {
  const ordersContainer = document.getElementById('orders-container');
  if (!ordersContainer) return;
  
  showLoading(ordersContainer);
  
  try {
    const orders = await fetchWithAuth('/orders');
    displayOrders(orders);
  } catch (error) {
    showToast(error.message, 'error');
    ordersContainer.innerHTML = `<p class="text-center text-muted">${error.message}</p>`;
  }
}

// Display orders
function displayOrders(orders) {
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
        <h3 class="text-lg font-semibold mb-2">No orders yet</h3>
        <p class="text-muted mb-4">You haven't placed any orders yet</p>
        <a href="/user/index.html" class="btn btn-primary">Start Shopping</a>
      </div>
    `;
    return;
  }
  
  ordersContainer.innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Date</th>
          <th>Items</th>
          <th>Total</th>
          <th>Status</th>
          <th>Actions</th>
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
      <td>${new Date(order.createdAt).toLocaleDateString()}</td>
      <td>${order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
      <td>${formatRp(order.total)}</td>
      <td>
        <span class="badge ${getStatusBadgeClass(order.status)}">
          ${order.status}
        </span>
      </td>
      <td>
        <a href="/user/order-detail.html?id=${order._id}" class="btn btn-outline btn-sm">Details</a>
      </td>
    `;
    ordersList.appendChild(orderRow);
  });
}

// Get status badge class
function getStatusBadgeClass(status) {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'badge-warning';
    case 'processing':
      return 'badge-primary';
    case 'completed':
      return 'badge-success';
    case 'cancelled':
      return 'badge-danger';
    default:
      return 'badge-primary';
  }
}

// Initialize orders page
document.addEventListener('DOMContentLoaded', () => {
  loadOrders();
});