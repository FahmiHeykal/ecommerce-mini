initPage();

// Login form handler
document.getElementById('login-form')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    
    const { token, role, userId } = await response.json();
    
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', userId);
    
    showToast('Login successful');
    
    setTimeout(() => {
      window.location.href = role === 'admin' ? '/admin/dashboard.html' : '/user/index.html';
    }, 1000);
    
  } catch (error) {
    showToast(error.message, 'error');
  }
});

// Register form handler
document.getElementById('register-form')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  
  if (data.password !== data.confirmPassword) {
    showToast('Passwords do not match', 'error');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    showToast('Registration successful. Please login.');
    
    setTimeout(() => {
      window.location.href = '/auth/login.html';
    }, 1500);
    
  } catch (error) {
    showToast(error.message, 'error');
  }
});