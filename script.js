// Initial Chart Data
const salesData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
        {
            label: 'Sales Revenue ($)',
            data: [65000, 59000, 80000, 81000, 56000, 85000],
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.1
        },
        {
            label: 'Units Sold',
            data: [1200, 1150, 1400, 1350, 1000, 1500],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0.1
        },
        {
            label: 'Customer Visits',
            data: [3000, 2800, 3200, 3100, 2600, 3500],
            borderColor: 'rgb(153, 102, 255)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            tension: 0.1
        }
    ]
};

// Initialize Main Sales Chart
const ctx = document.getElementById('salesChart').getContext('2d');
const salesChart = new Chart(ctx, {
    type: 'line',
    data: salesData,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            title: {
                display: true,
                text: 'Sales Performance Overview'
            },
            tooltip: {
                enabled: true,
                mode: 'index'
            },
            legend: {
                position: 'bottom'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            }
        }
    }
});

// Sample Product Data
let products = [
    { id: 1, name: 'Gaming Laptop', category: 'Electronics', price: 1299.99, stock: 50 },
    { id: 2, name: 'Denim Jeans', category: 'Clothing', price: 79.99, stock: 200 },
    { id: 3, name: 'Coffee Maker', category: 'Home Appliances', price: 149.99, stock: 35 },
    { id: 4, name: 'Wireless Earbuds', category: 'Electronics', price: 129.99, stock: 150 },
    { id: 5, name: 'Running Shoes', category: 'Footwear', price: 89.99, stock: 100 },
    { id: 6, name: 'Smart Watch', category: 'Electronics', price: 299.99, stock: 75 },
    { id: 7, name: 'Yoga Mat', category: 'Fitness', price: 29.99, stock: 120 },
    { id: 8, name: 'Blender', category: 'Home Appliances', price: 79.99, stock: 45 },
    { id: 9, name: 'Winter Jacket', category: 'Clothing', price: 199.99, stock: 80 },
    { id: 10, name: 'Gaming Mouse', category: 'Electronics', price: 59.99, stock: 90 }
];

// DOM Elements
const productsTable = document.getElementById('productsTable');
const addProductBtn = document.getElementById('addProduct');
const toggleMenuBtn = document.getElementById('toggleMenu');
const sidebar = document.getElementById('sidebar');
const modal = document.getElementById('productModal');

// Navigation Handler
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = e.target.dataset.section;
        
        // Update active link
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
        e.target.classList.add('active');
        
        // Show active section
        document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
        document.getElementById(`${section}-section`).classList.add('active');

        // Initialize charts if analytics section is active
        if (section === 'analytics') {
            initializeAnalyticsCharts();
        }
        if (section === 'products') {
            renderProductCards(products);
        }
    });
});

// Toggle Menu Function
toggleMenuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Get Category Color
function getCategoryColor(category) {
    const colors = {
        'Electronics': 'rgba(75, 192, 192, 0.1)',
        'Clothing': 'rgba(255, 99, 132, 0.1)',
        'Home Appliances': 'rgba(153, 102, 255, 0.1)',
        'Footwear': 'rgba(255, 159, 64, 0.1)',
        'Fitness': 'rgba(54, 162, 235, 0.1)'
    };
    return colors[category] || 'transparent';
}

// Render Products Table
function renderProducts() {
    const tbody = productsTable.querySelector('tbody');
    tbody.innerHTML = '';
    
    products.forEach(product => {
        const row = document.createElement('tr');
        row.style.backgroundColor = getCategoryColor(product.category);
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td>
                <button onclick="showProductDetails(${product.id})" class="view-btn">View</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Product Validation
function validateProduct(product) {
    if (!product.name || !product.category) {
        alert('Name and category are required!');
        return false;
    }
    if (isNaN(product.price) || product.price <= 0) {
        alert('Price must be a positive number!');
        return false;
    }
    if (isNaN(product.stock) || product.stock < 0) {
        alert('Stock must be a non-negative number!');
        return false;
    }
    return true;
}

// Add Product Handler
addProductBtn.addEventListener('click', () => {
    const newProduct = {
        id: products.length + 1,
        name: document.getElementById('productName').value,
        category: document.getElementById('category').value,
        price: parseFloat(document.getElementById('price').value),
        stock: parseInt(document.getElementById('stock').value)
    };

    if (validateProduct(newProduct)) {
        products.push(newProduct);
        renderProducts();
        renderProductCards(products);
        
        // Clear form
        document.getElementById('productName').value = '';
        document.getElementById('category').value = '';
        document.getElementById('price').value = '';
        document.getElementById('stock').value = '';
    }
});

// Search Functionality
const searchInput = document.querySelector('.search-input');
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.price.toString().includes(searchTerm)
    );
    
    renderProducts(filteredProducts);
    renderProductCards(filteredProducts);
});

// Show Product Details
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
        <h2>${product.name}</h2>
        <div class="product-details">
            <p><strong>Category:</strong> ${product.category}</p>
            <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
            <p><strong>Stock:</strong> ${product.stock} units</p>
            <p><strong>ID:</strong> ${product.id}</p>
            <div class="stock-status">
                <h4>Stock Status</h4>
                <div class="progress-bar">
                    <div class="progress" style="width: ${(product.stock / 200) * 100}%"></div>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Close Modal
document.querySelector('.close-modal').addEventListener('click', () => {
    modal.style.display = 'none';
});

// Click outside modal to close
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Category Filter Handler
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const category = e.target.dataset.category;
        
        // Update active button
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        // Filter products
        const filteredProducts = category === 'all' 
            ? products 
            : products.filter(p => p.category === category);
            
        renderProductCards(filteredProducts);
    });
});

// Render Product Cards
function renderProductCards(productsToRender) {
    const grid = document.querySelector('.products-grid');
    grid.innerHTML = '';
    
    productsToRender.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <h3>${product.name}</h3>
            <p>${product.category}</p>
            <p class="price">$${product.price.toFixed(2)}</p>
            <p class="stock">Stock: ${product.stock}</p>
        `;
        card.addEventListener('click', () => showProductDetails(product.id));
        grid.appendChild(card);
    });
}

// Initialize Analytics Charts
function initializeAnalyticsCharts() {
    // Calculate metrics
    const totalRevenue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const averagePrice = products.reduce((sum, p) => sum + p.price, 0) / products.length;
    const categoryCount = products.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
    }, {});

    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    new Chart(revenueCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Monthly Revenue',
                data: [65000, 59000, 80000, 81000, 56000, 85000],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
        }
    });

    // Category Distribution Chart
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    new Chart(categoryCtx, {
        type: 'pie',
        data: {
            labels: Object.keys(categoryCount),
            datasets: [{
                data: Object.values(categoryCount),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: true
        }
    });

    // Stock Levels Chart
    const stockCtx = document.getElementById('stockChart').getContext('2d');
    new Chart(stockCtx, {
        type: 'bar',
        data: {
            labels: products.map(p => p.name),
            datasets: [{
                label: 'Current Stock',
                data: products.map(p => p.stock),
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: 'y'
        }
    });

    // Update Metrics
    const metricsGrid = document.querySelector('.metrics-grid');
    metricsGrid.innerHTML = `
        <div class="metric-item">
            <h4>Total Revenue</h4>
            <p>$${totalRevenue.toFixed(2)}</p>
        </div>
        <div class="metric-item">
            <h4>Total Stock</h4>
            <p>${totalStock} units</p>
        </div>
        <div class="metric-item">
            <h4>Average Price</h4>
            <p>$${averagePrice.toFixed(2)}</p>
        </div>
        <div class="metric-item">
            <h4>Product Categories</h4>
            <p>${Object.keys(categoryCount).length}</p>
        </div>
    `;
}

// Initial render
renderProducts();
renderProductCards(products);