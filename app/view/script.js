document.addEventListener('DOMContentLoaded', () => {

    // login form
    const loginForm = document.querySelector('#loginModal form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 

            const emailInput = document.getElementById('loginEmail');
            const passwordInput = document.getElementById('password');

            // checks if elements exist
            if (!emailInput || !passwordInput) {
                console.error('Login form elements not found');
                return;
            }

            const email = emailInput.value;
            const password = passwordInput.value;

            // POST request to /register API
            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ Email: email, Password: password })
                });

                const data = await response.json();
                alert(data.message); 

                if (response.ok) {
                    window.location.href = '/'; // redirect to home
                }
            } catch (error) {
                console.error('Error during login:', error);
            }
        });
    }

    // register form
    const registerForm = document.querySelector('#registerModal form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // gets values
            const firstName = document.getElementById('registerFirstName').value;
            const lastName = document.getElementById('registerLastName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const dateOfBirth = document.getElementById('registerDateOfBirth').value;

            // ensures all fields are filled
            if (!firstName || !lastName || !email || !password || !dateOfBirth) {
                alert('Please fill in all fields.');
                return;
            }

            // POST request to /register API
            const response = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ FirstName: firstName, LastName: lastName, Email: email, Password: password, DateOfBirth: dateOfBirth })
            });

            const data = await response.json();
            alert(data.message); 

            if (response.ok) {
                // closes modal on success
                const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
                modal.hide();
            }
        });
    }
});
