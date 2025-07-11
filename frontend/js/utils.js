// API Base URL
const API_BASE_URL = 'http://localhost:8080';

// Check authentication and role
function checkAuth(requiredRole) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  if (!token) {
    if (window.location.pathname !== '/auth/login.html' && 
        window.location.pathname !== '/auth/register.html') {
      window.location.href = '/auth/login.html';
    }
    return false;
  }
  
  if (requiredRole && role !== requiredRole) {
    window.location.href = role === 'admin' ? '/admin/dashboard.html' : '/user/index.html';
    return false;
  }
  
  return true;
}

// Fetch with auth
async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  
  return response.json();
}

// Format currency
function formatRp(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
}

// Show toast notification
function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toast-container') || createToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = document.createElement('span');
  icon.innerHTML = type === 'success' ? '✓' : type === 'error' ? '✕' : '⚠';
  toast.appendChild(icon);
  
  const text = document.createElement('span');
  text.textContent = message;
  toast.appendChild(text);
  
  const closeBtn = document.createElement('span');
  closeBtn.className = 'toast-close';
  closeBtn.innerHTML = '&times;';
  closeBtn.onclick = () => toast.remove();
  toast.appendChild(closeBtn);
  
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 5000);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toast-container';
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

// Show confirmation modal
function showConfirm(message, onConfirm, onCancel = () => {}) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title">Confirmation</div>
        <span class="modal-close">&times;</span>
      </div>
      <div class="modal-body">
        <p>${message}</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" id="confirm-cancel">Cancel</button>
        <button class="btn btn-primary" id="confirm-ok">OK</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  const closeModal = () => {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.remove();
    }, 300);
  };
  
  modal.querySelector('.modal-close').onclick = () => {
    onCancel();
    closeModal();
  };
  
  modal.querySelector('#confirm-cancel').onclick = () => {
    onCancel();
    closeModal();
  };
  
  modal.querySelector('#confirm-ok').onclick = () => {
    onConfirm();
    closeModal();
  };
  
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);
}

// Logout function
function logout() {
  showConfirm('Are you sure you want to logout?', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    window.location.href = '/auth/login.html';
  });
}

// Initialize navbar based on role
function initNavbar() {
  const role = localStorage.getItem('role');
  const navbar = document.getElementById('navbar');
  
  if (!navbar) return;
  
  if (role === 'admin') {
    navbar.innerHTML = `
      <div class="nav-brand">
        <img src="/assets/logo.png" alt="Logo">
        <span>Admin Dashboard</span>
      </div>
      <div class="nav-links">
        <a href="/admin/dashboard.html" class="nav-link">Dashboard</a>
        <a href="/admin/add_product.html" class="nav-link">Add Product</a>
        <a href="/admin/orders.html" class="nav-link">Orders</a>
      </div>
      <div class="nav-actions">
        <button class="btn btn-outline btn-sm" onclick="logout()">Logout</button>
      </div>
    `;
  } else if (role === 'user') {
    navbar.innerHTML = `
      <div class="nav-brand">
        <img src="/assets/logo.png" alt="Logo">
        <span>ShopEase</span>
      </div>
      <div class="nav-links">
        <a href="/user/index.html" class="nav-link">Products</a>
        <a href="/user/cart.html" class="nav-link">Cart</a>
        <a href="/user/orders.html" class="nav-link">Orders</a>
      </div>
      <div class="nav-actions">
        <a href="/user/cart.html" class="nav-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </a>
        <button class="btn btn-outline btn-sm" onclick="logout()">Logout</button>
      </div>
    `;
  } else {
    navbar.innerHTML = `
      <div class="nav-brand">
        <img src="/assets/logo.png" alt="Logo">
        <span>ShopEase</span>
      </div>
      <div class="nav-actions">
        <a href="/auth/login.html" class="btn btn-outline btn-sm">Login</a>
        <a href="/auth/register.html" class="btn btn-primary btn-sm">Register</a>
      </div>
    `;
  }
}

// Initialize page
function initPage(requiredRole) {
  document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    
    if (requiredRole !== undefined) {
      checkAuth(requiredRole);
    }
  });
}

// Show loading state
function showLoading(element) {
  const loader = document.createElement('div');
  loader.className = 'loader-container';
  loader.innerHTML = '<div class="loader"></div>';
  element.innerHTML = '';
  element.appendChild(loader);
}

// Handle form errors
function displayFormErrors(formId, errors) {
  const form = document.getElementById(formId);
  if (!form) return;
  
  // Clear previous errors
  const errorElements = form.querySelectorAll('.error-message');
  errorElements.forEach(el => el.remove());
  
  // Add new errors
  Object.entries(errors).forEach(([field, message]) => {
    const input = form.querySelector(`[name="${field}"]`);
    if (input) {
      const error = document.createElement('div');
      error.className = 'error-message text-danger mt-1';
      error.textContent = message;
      input.parentNode.appendChild(error);
    }
  });
}

// Debounce function for search
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}