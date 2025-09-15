

document.addEventListener('DOMContentLoaded', () => {

   
    window.updateCartItemCount = function() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartItemCountSpan = document.getElementById('cart-item-count');
        if (cartItemCountSpan) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartItemCountSpan.textContent = totalItems;
        }
    };

   
    updateCartItemCount();


    const productListDiv = document.getElementById('product-list');
    if (productListDiv) {
        fetchProducts(); // Only fetch products if on a page that displays them
    }



    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const authLinks = document.getElementById('auth-links');
    const logoutLink = document.getElementById('logout-link');
    const welcomeMessage = document.getElementById('welcome-message'); // Assuming you have this in index.html

    if (token && username) {
        if (authLinks) authLinks.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'inline';
        if (welcomeMessage) welcomeMessage.textContent = `Welcome, ${username}!`;
    } else {
        if (authLinks) authLinks.style.display = 'inline';
        if (logoutLink) logoutLink.style.display = 'none';
        if (welcomeMessage) welcomeMessage.textContent = 'Welcome to Our Store!';
    }

    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('userId'); // Assuming you store userId
            alert('You have been logged out.');
            window.location.reload(); // Reload the page to update UI
        });
    }

 
    async function fetchProducts() {
        if (!productListDiv) return; 

        productListDiv.innerHTML = 'Loading products...';

        try {
            const response = await fetch('http://localhost:3000/api/products');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const products = await response.json();

            productListDiv.innerHTML = '';

            if (products.length === 0) {
                productListDiv.innerHTML = '<p>No products available at the moment.</p>';
                return;
            }

            products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.className = 'product-item';
                productDiv.innerHTML = `
                    <img src="${product.imageUrl}" alt="${product.name}" style="width:100%; max-height:200px; object-fit:contain; margin-bottom: 15px;">
                    <h3><a href="product_detail.html?id=${product.id}">${product.name}</a></h3>
                    <p>${product.description}</p>
                    <p><strong>$${product.price.toFixed(2)}</strong></p>
                    <button class="add-to-cart-btn"
                            data-product-id="${product.id}"
                            data-product-name="${product.name}"
                            data-product-price="${product.price}">Add to Cart</button>
                `;
                productListDiv.appendChild(productDiv);
            });

            
            document.querySelectorAll('.add-to-cart-btn').forEach(button => {
                button.addEventListener('click', addToCart);
            });

        } catch (error) {
            console.error('Error fetching products:', error);
            productListDiv.innerHTML = '<p>Error loading products. Please try again later.</p>';
        }
    }

    function addToCart(event) {
        const productId = event.target.dataset.productId;
        const productName = event.target.dataset.productName;
        const productPrice = parseFloat(event.target.dataset.productPrice);

        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        const existingItemIndex = cart.findIndex(item => item.id === productId);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${productName} added to cart!`);
        updateCartItemCount(); // Update the count in the header
    }

}); 