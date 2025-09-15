
document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('login-message');

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json(); 
            localStorage.setItem('token', data.token); 
            localStorage.setItem('username', data.username); 
            localStorage.setItem('userId', data.userId); 

            messageDiv.textContent = `Login successful! Welcome, ${data.username}!`;
            messageDiv.style.color = 'green';

            // Redirect to the homepage after successful login
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000); // Redirect after 1 second
        } else {
            const errorText = await response.text();
            messageDiv.textContent = `Login failed: ${errorText}`;
            messageDiv.style.color = 'red';
        }
    } catch (error) {
        console.error('Error during login:', error);
        messageDiv.textContent = 'An error occurred. Please try again.';
        messageDiv.style.color = 'red';
    }
});