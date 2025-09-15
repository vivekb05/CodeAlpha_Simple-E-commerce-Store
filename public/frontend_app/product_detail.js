
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId, productName, productPrice) {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
    }
    saveCart();
    alert(`${productName} added to cart!`);
    // No need to render cart on this page, as it's for details
}

// Authentication UI and Logout (copied from script.js)
function updateAuthUI() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const authLinks = document.getElementById('auth-links-nav');
    const logoutBtn = document.getElementById('logout-btn-nav');

    if (authLinks && logoutBtn) {
        if (token && username) {
            authLinks.innerHTML = `<span>Welcome, ${username}!</span>`;
            logoutBtn.style.display = 'inline-block';
        } else {
            authLinks.innerHTML = `
                <a href="login.html">Login</a>
                <a href="register.html">Register</a>
            `;
            logoutBtn.style.display = 'none';
        }
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    alert('Logged out successfully!');
    updateAuthUI();
    window.location.href = 'index.html'; // Redirect to home after logout
}


document.addEventListener('DOMContentLoaded', async () => {
    updateAuthUI(); // Update auth UI for this page
    const logoutBtn = document.getElementById('logout-btn-nav');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const productDetailContent = document.getElementById('product-detail-content');

    if (!productId) {
        productDetailContent.innerHTML = '<p>Product ID not found in URL. Please go back to the products page.</p>';
        return;
    }

    async function fetchProductDetails(id) {
        try {
            const response = await fetch(`http://localhost:3000/api/products/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const product = await response.json();
            renderProductDetails(product);
        } catch (error) {
            console.error('Error fetching product details:', error);
            productDetailContent.innerHTML = '<p>Error loading product details. Product might not exist or network issue.</p>';
        }
    }

    function renderProductDetails(product) {
        productDetailContent.innerHTML = `
            <h2>${product.name}</h2>
            <p><strong>Description:</strong> ${product.description}</p>
            <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
            <button class="add-to-cart-btn"
                    data-product-id="${product.id}"
                    data-product-name="${product.name}"
                    data-product-price="${product.price}">Add to Cart</button>
        `;
        // Add event listener for the "Add to Cart" button on the detail page
        document.querySelector('.add-to-cart-btn').addEventListener('click', (event) => {
            const productId = event.target.dataset.productId;
            const productName = event.target.dataset.productName;
            const productPrice = parseFloat(event.target.dataset.productPrice);
            addToCart(productId, productName, productPrice);
        });
    }

    fetchProductDetails(productId);
});