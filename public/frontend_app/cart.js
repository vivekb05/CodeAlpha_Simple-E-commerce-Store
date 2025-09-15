
document.addEventListener('DOMContentLoaded', () => {
    const cartListDiv = document.getElementById('cart-list');
    const cartTotalSpan = document.getElementById('cart-total');
    const cartSummaryDiv = document.getElementById('cart-summary');
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutMessageDiv = document.getElementById('checkout-message');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function renderCart() {
        if (cart.length === 0) {
            cartListDiv.innerHTML = '<p>Your cart is empty.</p>';
            cartSummaryDiv.style.display = 'none';
            updateCartItemCount(); // Update header cart count
            return;
        }

        cartListDiv.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <p>${item.name} - $${item.price.toFixed(2)} x
                    <input type="number" class="item-quantity" data-product-id="${item.id}" value="${item.quantity}" min="1" style="width: 50px;">
                    <button class="remove-from-cart-btn" data-product-id="${item.id}">Remove</button>
                </p>
            `;
            cartListDiv.appendChild(itemDiv);
            total += item.price * item.quantity;
        });

        cartTotalSpan.textContent = total.toFixed(2);
        cartSummaryDiv.style.display = 'block';

        document.querySelectorAll('.item-quantity').forEach(input => {
            input.addEventListener('change', updateQuantity);
        });
        document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
            button.addEventListener('click', removeFromCart);
        });

        updateCartItemCount(); 
    }

    function updateQuantity(event) {
        const productId = event.target.dataset.productId;
        const newQuantity = parseInt(event.target.value);

        cart = cart.map(item =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
        );
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart(); // Re-render to update total
    }

    function removeFromCart(event) {
        const productId = event.target.dataset.productId;
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }

    async function proceedToCheckout() {
        const token = localStorage.getItem('token');
        if (!token) {
            checkoutMessageDiv.textContent = 'Please log in to proceed with the checkout.';
            checkoutMessageDiv.style.color = 'red';
            // Optionally redirect to login page
            // setTimeout(() => window.location.href = 'login.html', 1500);
            return;
        }

        if (cart.length === 0) {
            checkoutMessageDiv.textContent = 'Your cart is empty. Please add items before checking out.';
            checkoutMessageDiv.style.color = 'orange';
            return;
        }

        const orderDetails = {
            cartItems: cart,
            total: parseFloat(cartTotalSpan.textContent)
        };

        try {
            const response = await fetch('http://localhost:3000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderDetails)
            });

            if (response.ok) {
                const result = await response.json();
                checkoutMessageDiv.textContent = `Order placed successfully! Order ID: ${result.orderId}. Thank you for your purchase!`;
                checkoutMessageDiv.style.color = 'green';
                cart = []; // Clear cart after successful order
                localStorage.removeItem('cart');
                renderCart(); // Re-render cart (should show empty)
            } else {
                const errorText = await response.text();
                checkoutMessageDiv.textContent = `Checkout failed: ${errorText}`;
                checkoutMessageDiv.style.color = 'red';
            }
        } catch (error) {
            console.error('Error during checkout:', error);
            checkoutMessageDiv.textContent = 'An error occurred during checkout. Please try again.';
            checkoutMessageDiv.style.color = 'red';
        }
    }

    checkoutBtn.addEventListener('click', proceedToCheckout);

    // Initial render when the page loads
    renderCart();
});

