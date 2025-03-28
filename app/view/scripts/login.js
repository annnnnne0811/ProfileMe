// view/scripts/login.js

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

        const res = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ FirstName, LastName, Email, Password, DateOfBirth })
        });

        const data = await res.json();
        if (!res.ok) return alert(data.message);

        bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
        checkSession();
    });
});
