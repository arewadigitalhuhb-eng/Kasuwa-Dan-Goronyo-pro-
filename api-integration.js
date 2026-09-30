/**
 * Updated app.js with backend API integration
 * Replace old localStorage-only code with API calls
 */

// ==========================================
// AUTHENTICATION WITH API
// ==========================================

async function loginUser(email, password) {
  try {
    const response = await api.auth.login({ email, password });
    api.setToken(response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    showNotification('Login successful!', 'success');
    window.location.href = 'dashboard.html';
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

async function registerUser(name, email, password, storeName) {
  try {
    const response = await api.auth.register({ name, email, password, storeName });
    api.setToken(response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    showNotification('Registration successful! Setting up your store...', 'success');
    setTimeout(() => {
      window.location.href = 'merchant-profile.html';
    }, 1500);
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

async function logoutUser() {
  if (confirm('Are you sure you want to logout?')) {
    api.clearToken();
    localStorage.removeItem('user');
    showNotification('Logged out successfully!', 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  }
}

// ==========================================
// MERCHANT PROFILE WITH API
// ==========================================

async function saveMerchantProfile() {
  try {
    const businessName = document.getElementById('businessName')?.value;
    const businessType = document.getElementById('businessType')?.value;
    const countryCode = document.getElementById('countryCode')?.value || 'NG';
    const city = document.getElementById('city')?.value;
    const address = document.getElementById('address')?.value;
    const phone = document.getElementById('phone')?.value;

    const response = await api.merchant.createProfile({
      businessName,
      businessType,
      countryCode,
      city,
      address,
      phone,
    });

    showNotification('Profile saved successfully!', 'success');
    window.location.href = 'dashboard.html';
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

// ==========================================
// PRODUCTS WITH API
// ==========================================

async function loadProducts() {
  try {
    const products = await api.products.getAll();
    displayProducts(products);
  } catch (error) {
    showNotification('Failed to load products', 'error');
  }
}

async function createProduct(formData) {
  try {
    const product = await api.products.create(formData);
    showNotification('Product created successfully!', 'success');
    loadProducts();
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

async function updateProduct(productId, formData) {
  try {
    const product = await api.products.update(productId, formData);
    showNotification('Product updated successfully!', 'success');
    loadProducts();
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

// ==========================================
// SALES WITH API
// ==========================================

async function createSale(saleData) {
  try {
    const sale = await api.sales.create(saleData);
    showNotification('Sale completed successfully!', 'success');
    return sale;
  } catch (error) {
    showNotification(error.message, 'error');
    throw error;
  }
}

async function loadSales() {
  try {
    const sales = await api.sales.getAll();
    displaySales(sales);
  } catch (error) {
    showNotification('Failed to load sales', 'error');
  }
}

// ==========================================
// SUBSCRIPTION PORTAL
// ==========================================

async function loadSubscriptionPlans() {
  try {
    const response = await api.merchant.getPlans();
    displayPlanOptions(response.plans);
  } catch (error) {
    showNotification('Failed to load plans', 'error');
  }
}

async function upgradeSubscription(newPlan, billingCycle = 'monthly') {
  try {
    const response = await api.merchant.requestUpgrade({ newPlan, billingCycle });
    showNotification('Subscription upgrade initiated!', 'success');
    localStorage.setItem('pendingInvoice', JSON.stringify(response.invoice));
    window.location.href = 'payment.html';
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

// ==========================================
// ADMIN DASHBOARD
// ==========================================

async function loadAdminDashboard() {
  try {
    const dashboard = await api.admin.getDashboard();
    displayAdminDashboard(dashboard);
  } catch (error) {
    showNotification('Failed to load dashboard', 'error');
  }
}

async function loadMerchantsForAdmin(page = 1, status = 'all') {
  try {
    const response = await api.admin.getMerchants({ page, status });
    displayMerchantsList(response.merchants, response.pagination);
  } catch (error) {
    showNotification('Failed to load merchants', 'error');
  }
}

async function verifyMerchantKYC(merchantId, verified, notes = '') {
  try {
    const response = await api.admin.verifyMerchantKYC(merchantId, {
      kycVerified: verified,
      status: verified ? 'verified' : 'pending',
      notes,
    });
    showNotification('Merchant verified successfully!', 'success');
    loadMerchantsForAdmin();
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

async function suspendMerchantAccount(merchantId, reason) {
  try {
    const response = await api.admin.suspendMerchant(merchantId, { reason });
    showNotification('Merchant account suspended!', 'success');
    loadMerchantsForAdmin();
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

async function loadPaymentsForAdmin(page = 1, status = 'all') {
  try {
    const response = await api.admin.getPayments({ page, status });
    displayPaymentsList(response.transactions, response.stats, response.pagination);
  } catch (error) {
    showNotification('Failed to load payments', 'error');
  }
}

async function confirmPaymentManually(transactionId, notes = '') {
  try {
    const response = await api.admin.confirmPayment(transactionId, { notes });
    showNotification('Payment confirmed successfully!', 'success');
    loadPaymentsForAdmin();
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

async function loadRevenueReport(startDate, endDate, groupBy = 'day') {
  try {
    const response = await api.admin.getRevenueReport({ startDate, endDate, groupBy });
    displayRevenueChart(response.report);
  } catch (error) {
    showNotification('Failed to load report', 'error');
  }
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function displayProducts(products) {
  const container = document.getElementById('productsContainer');
  if (!container) return;
  container.innerHTML = products.map(p => `
    <div class="product-card">
      <h3>${p.name}</h3>
      <p>Price: ₦${formatNumber(p.sellingPrice)}</p>
      <p>Stock: ${p.quantity}</p>
      <button onclick="editProduct('${p._id}')">Edit</button>
    </div>
  `).join('');
}

function displaySales(sales) {
  const container = document.getElementById('salesContainer');
  if (!container) return;
  container.innerHTML = sales.map(s => `
    <div class="sale-item">
      <p>${s.customerName}</p>
      <p>Amount: ₦${formatNumber(s.total)}</p>
      <p>Date: ${new Date(s.createdAt).toLocaleDateString()}</p>
    </div>
  `).join('');
}

function displayAdminDashboard(dashboard) {
  document.getElementById('totalMerchants').textContent = dashboard.summary.totalMerchants;
  document.getElementById('activeMerchants').textContent = dashboard.summary.activeMerchants;
  document.getElementById('totalRevenue').textContent = '₦' + formatNumber(dashboard.summary.totalRevenue);
  document.getElementById('totalTransactions').textContent = dashboard.summary.totalTransactions;
}

function displayMerchantsList(merchants, pagination) {
  const container = document.getElementById('merchantsTable');
  if (!container) return;
  container.innerHTML = merchants.map(m => `
    <tr>
      <td>${m.userId.name}</td>
      <td>${m.businessName}</td>
      <td>${m.status}</td>
      <td>${m.kycVerified ? '✓' : '✗'}</td>
      <td><button onclick="viewMerchant('${m._id}')">View</button></td>
    </tr>
  `).join('');
}

function displayPaymentsList(transactions, stats, pagination) {
  const container = document.getElementById('paymentsTable');
  if (!container) return;
  container.innerHTML = transactions.map(t => `
    <tr>
      <td>${t.transactionId}</td>
      <td>${t.userId.name}</td>
      <td>₦${formatNumber(t.amount)}</td>
      <td>${t.status}</td>
      <td>
        ${t.status === 'pending' ? `<button onclick="confirmPayment('${t._id}')">Confirm</button>` : ''}
      </td>
    </tr>
  `).join('');
}

// Load API client on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const script = document.createElement('script');
    script.src = 'api-client.js';
    document.head.appendChild(script);
  });
} else {
  const script = document.createElement('script');
  script.src = 'api-client.js';
  document.head.appendChild(script);
}
