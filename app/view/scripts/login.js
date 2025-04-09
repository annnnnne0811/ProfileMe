document.addEventListener('DOMContentLoaded', () => {
    checkSession();

    async function checkSession() {
        const res = await fetch('/check-session', { credentials: 'include' });
        const isLoggedIn = res.ok;
        const data = isLoggedIn ? await res.json() : {};

        document.getElementById('headerLoginBtn').style.display = isLoggedIn ? 'none' : 'block';
        document.getElementById('headerRegisterBtn').style.display = isLoggedIn ? 'none' : 'block';
        document.getElementById('headerLogoutBtn').style.display = isLoggedIn ? 'block' : 'none';
        document.getElementById('loginBtn').style.display = isLoggedIn ? 'none' : 'block';
        document.getElementById('registerBtn').style.display = isLoggedIn ? 'none' : 'block';
        document.getElementById('logoutBtn').style.display = isLoggedIn ? 'block' : 'none';

        document.getElementById('sidebarMenuLabel').textContent = isLoggedIn
            ? `Welcome, ${data.FirstName} ${data.LastName}!`
            : 'Menu';
    }

    async function logoutUser() {
        await fetch('/logout', { method: 'POST', credentials: 'include' });
        checkSession();
        window.location.href = '/';
    }

    document.getElementById('headerLogoutBtn').addEventListener('click', logoutUser);
    document.getElementById('logoutBtn').addEventListener('click', logoutUser);

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const Email = document.getElementById('loginEmail').value;
        const Password = document.getElementById('password').value;

        const res = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ Email, Password })
        });

        const data = await res.json();
        if (!res.ok) return alert(data.message);

        bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
        window.location.href = '/vid';
    });

    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const FirstName = document.getElementById('registerFirstName').value;
        const LastName = document.getElementById('registerLastName').value;
        const Email = document.getElementById('registerEmail').value;
        const Password = document.getElementById('registerPassword').value;
        const DateOfBirth = document.getElementById('registerDateOfBirth').value;

        // Register the user
        const registerRes = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ FirstName, LastName, Email, Password, DateOfBirth })
        });

        const registerData = await registerRes.json();
        if (!registerRes.ok) return alert(registerData.message);

        // Automatically log the user in
        const loginRes = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ Email, Password })
        });

        const loginData = await loginRes.json();
        if (!loginRes.ok) {
            // If login fails, show an error but still close the modal
            alert(loginData.message || 'Registration successful, but auto-login failed. Please log in manually.');
            bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
            checkSession();
            return;
        }

        // Close the modal and redirect to the profile page
        bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
        checkSession();
        window.location.href = '/vid'; // Redirect to the profile page
    });
});