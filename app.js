/**
 * KASUWA DAN GORONYO - MAIN APP
 * ==========================================
 */

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function formatCurrency(amount) {
    const currency = JSON.parse(localStorage.getItem('user'))?.currency || '₦';
    return currency + parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function formatNumber(num) {
    return parseFloat(num).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Today, ' + date.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday, ' + date.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });
    } else {
        return date.toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' });
    }
}

function formatTime(dateString) {
    return new Date(dateString).toLocaleTimeString('en-NG', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ==========================================
// NOTIFICATION SYSTEM
// ==========================================

function showNotification(message, type = 'info', duration = 3000) {
    // Check if sound is enabled
    const settings = JSON.parse(localStorage.getItem('settings')) || {};
    if (settings.sound !== false) {
        playNotificationSound(type);
    }

    // Create notification container if it doesn't exist
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };

    notification.innerHTML = `
        <i class="fas ${icons[type] || icons.info}"></i>
        <span>${escapeHtml(message)}</span>
    `;

    container.appendChild(notification);

    // Remove after duration
    setTimeout(() => {
        notification.remove();
    }, duration);
}

function playNotificationSound(type) {
    // Simple beep using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        const frequencies = {
            success: 800,
            error: 300,
            info: 600,
            warning: 500
        };

        oscillator.frequency.value = frequencies[type] || 600;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        // Audio not supported, silent fallback
    }
}

// ==========================================
// NAVIGATION
// ==========================================

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = 'index.html';
    }
}

function goToPage(page) {
    window.location.href = page;
}

// ==========================================
// INITIALIZATION
// ==========================================

function initializeApp() {
    // Check if first run
    if (!localStorage.getItem('appInitialized')) {
        setupInitialData();
        localStorage.setItem('appInitialized', 'true');
    }

    // Setup global event listeners
    setupGlobalEvents();
    
    // Load user data
    loadUserData();
}

function setupInitialData() {
    // Default user
    const defaultUser = {
        name: 'Mallam Abdullahi',
        email: '',
        phone: '',
        storeName: 'Kasuwa Dan Goronyo',
        storeAddress: '',
        currency: '₦',
        role: 'Store Owner',
        createdAt: new Date().toISOString()
    };

    // Default categories
    const defaultCategories = [
        { id: 1, name: 'Grains', icon: 'fa-wheat', createdAt: new Date().toISOString() },
        { id: 2, name: 'Oils', icon: 'fa-oil-can', createdAt: new Date().toISOString() },
        { id: 3, name: 'Spices', icon: 'fa-pepper-hot', createdAt: new Date().toISOString() },
        { id: 4, name: 'Beverages', icon: 'fa-coffee', createdAt: new Date().toISOString() },
        { id: 5, name: 'Others', icon: 'fa-box', createdAt: new Date().toISOString() }
    ];

    // Default settings
    const defaultSettings = {
        notifications: true,
        sound: true,
        darkMode: false,
        currency: '₦',
        receipt: {
            header: 'Kasuwa Dan Goronyo',
            footer: 'Thank you for your business!',
            showLogo: true,
            showBarcode: true
        },
        tax: {
            enabled: false,
            rate: 7.5,
            name: 'VAT'
        }
    };

    // Sample products for demo
    const sampleProducts = [
        {
            id: Date.now() + 1,
            name: 'Rice 50kg',
            category: 'Grains',
            quantity: 25,
            costPrice: 35000,
            sellingPrice: 40000,
            lowStockAlert: 5,
            barcode: '',
            createdAt: new Date().toISOString()
        },
        {
            id: Date.now() + 2,
            name: 'Vegetable Oil 5L',
            category: 'Oils',
            quantity: 15,
            costPrice: 4500,
            sellingPrice: 5500,
            lowStockAlert: 3,
            barcode: '',
            createdAt: new Date().toISOString()
        },
        {
            id: Date.now() + 3,
            name: 'Maggi Cubes (Pack)',
            category: 'Spices',
            quantity: 50,
            costPrice: 350,
            sellingPrice: 500,
            lowStockAlert: 10,
            barcode: '',
            createdAt: new Date().toISOString()
        }
    ];

    localStorage.setItem('user', JSON.stringify(defaultUser));
    localStorage.setItem('categories', JSON.stringify(defaultCategories));
    localStorage.setItem('settings', JSON.stringify(defaultSettings));
    localStorage.setItem('products', JSON.stringify(sampleProducts));
    localStorage.setItem('sales', JSON.stringify([]));
    localStorage.setItem('customers', JSON.stringify([]));
}

function setupGlobalEvents() {
    // Close modals on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });

    // Handle online/offline
    window.addEventListener('online', () => {
        showNotification('Back online!', 'success');
    });

    window.addEventListener('offline', () => {
        showNotification('You are offline. Some features may be limited.', 'warning');
    });

    // Prevent double-tap zoom on iOS
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}

function loadUserData() {
    const user = JSON.parse(localStorage.getItem('user')) || { name: 'Mallam Abdullahi' };
    
    // Update all user name elements
    document.querySelectorAll('#userName, #settingsUserName, #profileName').forEach(el => {
        if (el) el.textContent = user.name;
    });

    // Update welcome text if on dashboard
    const welcomeText = document.getElementById('welcomeText');
    if (welcomeText) {
        welcomeText.textContent = `Welcome back, ${user.name.split(' ')[0]}!`;
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    
    const overlay = document.getElementById('overlay');
    if (overlay) overlay.classList.remove('active');
    
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('active');
}

// ==========================================
// DATA MANAGEMENT
// ==========================================

function getProducts() {
    return JSON.parse(localStorage.getItem('products')) || [];
}

function getSales() {
    return JSON.parse(localStorage.getItem('sales')) || [];
}

function getCustomers() {
    return JSON.parse(localStorage.getItem('customers')) || [];
}

function getCategories() {
    return JSON.parse(localStorage.getItem('categories')) || [];
}

function saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
}

function saveSales(sales) {
    localStorage.setItem('sales', JSON.stringify(sales));
}

function saveCustomers(customers) {
    localStorage.setItem('customers', JSON.stringify(customers));
}

function saveCategories(categories) {
    localStorage.setItem('categories', JSON.stringify(categories));
}

// ==========================================
// CALCULATIONS
// ==========================================

function calculateProfit(sale) {
    const cost = sale.items.reduce((sum, item) => {
        return sum + (item.costPrice * item.quantity);
    }, 0);
    return sale.total - cost - (sale.discount || 0);
}

function getTodaySales() {
    const sales = getSales();
    const today = new Date().toDateString();
    return sales.filter(s => new Date(s.date).toDateString() === today);
}

function getInventoryValue() {
    const products = getProducts();
    return products.reduce((sum, p) => sum + (p.costPrice * p.quantity), 0);
}

function getLowStockProducts() {
    const products = getProducts();
    return products.filter(p => p.quantity <= (p.lowStockAlert || 10) && p.quantity > 0);
}

function getOutOfStockProducts() {
    const products = getProducts();
    return products.filter(p => p.quantity === 0);
}

// ==========================================
// EXPORT/IMPORT
// ==========================================

function exportToJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function exportToCSV(data, headers, filename) {
    const csvContent = [
        headers.join(','),
        ...data.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importFromJSON(callback) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(event) {
            try {
                const data = JSON.parse(event.target.result);
                callback(null, data);
            } catch (err) {
                callback(err, null);
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// ==========================================
// VALIDATION
// ==========================================

function validatePhone(phone) {
    const regex = /^[0-9]{10,11}$/;
    return regex.test(phone.replace(/\s/g, ''));
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validateRequired(value) {
    return value && value.toString().trim().length > 0;
}

function validateNumber(value, min = 0) {
    const num = parseFloat(value);
    return !isNaN(num) && num >= min;
}

// ==========================================
// SESSION MANAGEMENT
// ==========================================

function checkSession() {
    const session = localStorage.getItem('currentSession');
    if (!session) {
        // Optional: redirect to login
        return false;
    }
    return true;
}

function createSession(userData) {
    const session = {
        user: userData,
        loginTime: new Date().toISOString(),
        token: generateId()
    };
    localStorage.setItem('currentSession', JSON.stringify(session));
}

function clearSession() {
    localStorage.removeItem('currentSession');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        clearSession();
        showNotification('Logged out successfully!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

// ==========================================
// SERVICE WORKER (PWA)
// ==========================================

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('SW registered:', registration);
            })
            .catch(error => {
                console.log('SW registration failed:', error);
            });
    }
}

// ==========================================
// INITIALIZE ON LOAD
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    
    // Register service worker for PWA
    if (window.location.protocol === 'https:' || window.location.hostname === 'localhost') {
        registerServiceWorker();
    }
});
