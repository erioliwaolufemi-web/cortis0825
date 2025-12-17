document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const successMessage = document.getElementById('successMessage');
    const registerButton = form.querySelector('button[type="submit"]');
    const API_URL = 'http://localhost:5000/api/register'; 

    const setError = (id, message) => {
        const errorElement = document.getElementById(id);
        errorElement.textContent = message;
    };

    const validateUsername = (username) => {
        if (username.length < 4) { setError('usernameError', 'Username must be at least 4 characters.'); return false; }
        setError('usernameError', ''); return true;
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) { setError('emailError', 'Please enter a valid email address.'); return false; }
        setError('emailError', ''); return true;
    };

    const validatePassword = (password) => {
        if (password.length < 8) { setError('passwordError', 'Password must be at least 8 characters.'); return false; }
        setError('passwordError', ''); return true;
    };


    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = form.username.value.trim();
        const email = form.email.value.trim();
        const password = form.password.value;
        const faveMember = form.faveMember.value;

        const isUsernameValid = validateUsername(username);
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);

        if (!isUsernameValid || !isEmailValid || !isPasswordValid) { return; }
        
        registerButton.textContent = 'Processing...'; 
        registerButton.disabled = true;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, faveMember })
            });

            const data = await response.json();

            if (response.ok) {
                form.classList.add('hidden');
                successMessage.classList.remove('hidden');
            } else {
                alert(`Registration Failed: ${data.msg || 'An unknown server error occurred.'}`);
            }

        } catch (error) {
            console.error('Network or Fetch Error:', error);
            alert('Could not connect to the server. Please ensure the backend server is running on port 5000.');
        } finally {
            registerButton.textContent = 'Create Glowroom ID'; 
            registerButton.disabled = false;
        }
    });

    form.username.addEventListener('blur', () => validateUsername(form.username.value.trim()));
    form.email.addEventListener('blur', () => validateEmail(form.email.value.trim()));
    form.password.addEventListener('blur', () => validatePassword(form.password.value));
});