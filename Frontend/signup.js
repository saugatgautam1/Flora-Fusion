document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        if (response.ok) {
            const result = await response.text();
            alert(result);
            window.location.href = 'login.html'; // Redirect to login page
        } else {
            const result = await response.text();
            alert('Error: ' + result);
        }
    } catch (error) {
        alert('An error occurred: ' + error.message);
    }
});
