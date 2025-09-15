
document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('register-message');

    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            messageDiv.textContent = 'Registration successful! You can now login.';
            messageDiv.style.color = 'green';
            document.getElementById('register-form').reset(); // Clear form
            // Optionally redirect to login page after a short delay
            // setTimeout(() => window.location.href = 'login.html', 2000);
        } else {
            const errorText = await response.text(); // Get error message from backend
            messageDiv.textContent = `Registration failed: ${errorText}`;
            messageDiv.style.color = 'red';
        }
    } catch (error) {
        console.error('Error during registration:', error);
        messageDiv.textContent = 'An error occurred. Please try again.';
        messageDiv.style.color = 'red';
    }
});